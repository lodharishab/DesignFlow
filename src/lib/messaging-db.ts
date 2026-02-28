'use server';
import { db, isDbEnabled } from './db';
import { conversations, messages, chatFiles } from './schema';
import { eq, desc, or, and } from 'drizzle-orm';

// ============================================================================
// Types
// ============================================================================

export interface Conversation {
  id: string;
  orderId?: string;
  participantOneId?: string;
  participantTwoId?: string;
  participantOneName?: string;
  participantTwoName?: string;
  participantOneAvatarUrl?: string;
  participantTwoAvatarUrl?: string;
  participantOneAvatarHint?: string;
  participantTwoAvatarHint?: string;
  lastMessage?: string;
  lastMessageTimestamp?: Date;
  lastReadTimestampOne?: Date;
  lastReadTimestampTwo?: Date;
  unreadCountOne: number;
  unreadCountTwo: number;
  isPinnedOne: boolean;
  isPinnedTwo: boolean;
  isArchived: boolean;
  isMuted: boolean;
  messages?: Message[];
  sharedFiles?: ChatFile[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId?: string;
  senderRole?: string;
  text?: string;
  timestamp: Date;
  status: string;
  isPinned: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

export interface ChatFile {
  id: string;
  conversationId: string;
  name: string;
  size?: number;
  type?: string;
  url: string;
  timestamp: Date;
}

// ============================================================================
// Row mappers
// ============================================================================

function rowToConversation(row: typeof conversations.$inferSelect): Conversation {
  return {
    id: row.id,
    orderId: row.orderId || undefined,
    participantOneId: row.participantOneId || undefined,
    participantTwoId: row.participantTwoId || undefined,
    participantOneName: row.participantOneName || undefined,
    participantTwoName: row.participantTwoName || undefined,
    participantOneAvatarUrl: row.participantOneAvatarUrl || undefined,
    participantTwoAvatarUrl: row.participantTwoAvatarUrl || undefined,
    participantOneAvatarHint: row.participantOneAvatarHint || undefined,
    participantTwoAvatarHint: row.participantTwoAvatarHint || undefined,
    lastMessage: row.lastMessage || undefined,
    lastMessageTimestamp: row.lastMessageTimestamp ? new Date(row.lastMessageTimestamp) : undefined,
    lastReadTimestampOne: row.lastReadTimestampOne ? new Date(row.lastReadTimestampOne) : undefined,
    lastReadTimestampTwo: row.lastReadTimestampTwo ? new Date(row.lastReadTimestampTwo) : undefined,
    unreadCountOne: row.unreadCountOne || 0,
    unreadCountTwo: row.unreadCountTwo || 0,
    isPinnedOne: row.isPinnedOne || false,
    isPinnedTwo: row.isPinnedTwo || false,
    isArchived: row.isArchived || false,
    isMuted: row.isMuted || false,
  };
}

function rowToMessage(row: typeof messages.$inferSelect): Message {
  return {
    id: row.id,
    conversationId: row.conversationId,
    senderId: row.senderId || undefined,
    senderRole: row.senderRole || undefined,
    text: row.text || undefined,
    timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
    status: row.status || 'sent',
    isPinned: row.isPinned || false,
    fileUrl: row.fileUrl || undefined,
    fileName: row.fileName || undefined,
    fileSize: row.fileSize || undefined,
    fileType: row.fileType || undefined,
  };
}

function rowToChatFile(row: typeof chatFiles.$inferSelect): ChatFile {
  return {
    id: row.id,
    conversationId: row.conversationId,
    name: row.name,
    size: row.size || undefined,
    type: row.type || undefined,
    url: row.url,
    timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
  };
}

// ============================================================================
// Conversations CRUD
// ============================================================================

export async function getConversationsByUser(userId: string): Promise<Conversation[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(conversations)
      .where(or(
        eq(conversations.participantOneId, userId),
        eq(conversations.participantTwoId, userId),
      ))
      .orderBy(desc(conversations.lastMessageTimestamp));
    return rows.map(rowToConversation);
  } catch (e) {
    console.error('Error fetching conversations:', e);
    return [];
  }
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!rows[0]) return null;
    const conv = rowToConversation(rows[0]);
    // Load messages and shared files
    const [msgs, files] = await Promise.all([
      db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.timestamp),
      db.select().from(chatFiles).where(eq(chatFiles.conversationId, id)).orderBy(desc(chatFiles.timestamp)),
    ]);
    conv.messages = msgs.map(rowToMessage);
    conv.sharedFiles = files.map(rowToChatFile);
    return conv;
  } catch (e) {
    console.error('Error fetching conversation by id:', e);
    return null;
  }
}

export async function getConversationByOrderId(orderId: string): Promise<Conversation | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.select().from(conversations).where(eq(conversations.orderId, orderId));
    if (!rows[0]) return null;
    return rowToConversation(rows[0]);
  } catch (e) {
    console.error('Error fetching conversation by order:', e);
    return null;
  }
}

export async function getAllConversations(): Promise<Conversation[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(conversations).orderBy(desc(conversations.lastMessageTimestamp));
    return rows.map(rowToConversation);
  } catch (e) {
    console.error('Error fetching all conversations:', e);
    return [];
  }
}

export async function createConversation(data: Omit<Conversation, 'messages' | 'sharedFiles'>): Promise<Conversation | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(conversations).values({
      id: data.id,
      orderId: data.orderId || null,
      participantOneId: data.participantOneId || null,
      participantTwoId: data.participantTwoId || null,
      participantOneName: data.participantOneName || null,
      participantTwoName: data.participantTwoName || null,
      participantOneAvatarUrl: data.participantOneAvatarUrl || null,
      participantTwoAvatarUrl: data.participantTwoAvatarUrl || null,
      participantOneAvatarHint: data.participantOneAvatarHint || null,
      participantTwoAvatarHint: data.participantTwoAvatarHint || null,
      lastMessage: data.lastMessage || null,
      lastMessageTimestamp: data.lastMessageTimestamp || null,
      unreadCountOne: data.unreadCountOne || 0,
      unreadCountTwo: data.unreadCountTwo || 0,
      isPinnedOne: data.isPinnedOne || false,
      isPinnedTwo: data.isPinnedTwo || false,
      isArchived: data.isArchived || false,
      isMuted: data.isMuted || false,
    }).returning();
    return rows[0] ? rowToConversation(rows[0]) : null;
  } catch (error) {
    console.error('Error creating conversation:', error);
    return null;
  }
}

export async function updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation | null> {
  if (!isDbEnabled()) return null;
  try {
    const uv: Record<string, unknown> = {};
    if (data.lastMessage !== undefined) uv.lastMessage = data.lastMessage;
    if (data.lastMessageTimestamp !== undefined) uv.lastMessageTimestamp = data.lastMessageTimestamp;
    if (data.unreadCountOne !== undefined) uv.unreadCountOne = data.unreadCountOne;
    if (data.unreadCountTwo !== undefined) uv.unreadCountTwo = data.unreadCountTwo;
    if (data.isPinnedOne !== undefined) uv.isPinnedOne = data.isPinnedOne;
    if (data.isPinnedTwo !== undefined) uv.isPinnedTwo = data.isPinnedTwo;
    if (data.isArchived !== undefined) uv.isArchived = data.isArchived;
    if (data.isMuted !== undefined) uv.isMuted = data.isMuted;
    if (data.lastReadTimestampOne !== undefined) uv.lastReadTimestampOne = data.lastReadTimestampOne;
    if (data.lastReadTimestampTwo !== undefined) uv.lastReadTimestampTwo = data.lastReadTimestampTwo;
    if (Object.keys(uv).length === 0) return null;
    const rows = await db.update(conversations).set(uv).where(eq(conversations.id, id)).returning();
    return rows[0] ? rowToConversation(rows[0]) : null;
  } catch (error) {
    console.error('Error updating conversation:', error);
    return null;
  }
}

export async function deleteConversation(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(conversations).where(eq(conversations.id, id)).returning({ id: conversations.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return false;
  }
}

// ============================================================================
// Messages CRUD
// ============================================================================

export async function getMessagesByConversation(conversationId: string): Promise<Message[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.timestamp);
    return rows.map(rowToMessage);
  } catch (e) {
    console.error('Error fetching messages:', e);
    return [];
  }
}

export async function createMessage(data: Message): Promise<Message | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(messages).values({
      id: data.id,
      conversationId: data.conversationId,
      senderId: data.senderId || null,
      senderRole: data.senderRole || null,
      text: data.text || null,
      timestamp: data.timestamp || new Date(),
      status: data.status || 'sent',
      isPinned: data.isPinned || false,
      fileUrl: data.fileUrl || null,
      fileName: data.fileName || null,
      fileSize: data.fileSize || null,
      fileType: data.fileType || null,
    }).returning();
    // Update conversation lastMessage
    if (rows[0]) {
      await db.update(conversations).set({
        lastMessage: data.text || (data.fileName ? `📎 ${data.fileName}` : 'File'),
        lastMessageTimestamp: data.timestamp || new Date(),
      }).where(eq(conversations.id, data.conversationId));
    }
    return rows[0] ? rowToMessage(rows[0]) : null;
  } catch (error) {
    console.error('Error creating message:', error);
    return null;
  }
}

export async function updateMessageStatus(id: string, status: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.update(messages).set({ status }).where(eq(messages.id, id)).returning({ id: messages.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error updating message status:', error);
    return false;
  }
}

export async function toggleMessagePin(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const existing = await db.select({ isPinned: messages.isPinned }).from(messages).where(eq(messages.id, id));
    if (!existing[0]) return false;
    await db.update(messages).set({ isPinned: !existing[0].isPinned }).where(eq(messages.id, id));
    return true;
  } catch (error) {
    console.error('Error toggling message pin:', error);
    return false;
  }
}

// ============================================================================
// Chat Files CRUD
// ============================================================================

export async function getChatFilesByConversation(conversationId: string): Promise<ChatFile[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(chatFiles)
      .where(eq(chatFiles.conversationId, conversationId))
      .orderBy(desc(chatFiles.timestamp));
    return rows.map(rowToChatFile);
  } catch (e) {
    console.error('Error fetching chat files:', e);
    return [];
  }
}

export async function createChatFile(data: ChatFile): Promise<ChatFile | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(chatFiles).values({
      id: data.id,
      conversationId: data.conversationId,
      name: data.name,
      size: data.size || null,
      type: data.type || null,
      url: data.url,
      timestamp: data.timestamp || new Date(),
    }).returning();
    return rows[0] ? rowToChatFile(rows[0]) : null;
  } catch (error) {
    console.error('Error creating chat file:', error);
    return null;
  }
}
