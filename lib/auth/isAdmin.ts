import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { ADMIN_EMAILS } from '@/lib/constants/admins';

export async function isAdmin(userId: string): Promise<boolean> {
  await dbConnect();
  const user = await User.findOne({ clerkId: userId }).lean();
  if (!user) return false;

  const u = user as { role?: string; email?: string };
  return u.role === 'admin' || ADMIN_EMAILS.includes(u.email || '');
}
