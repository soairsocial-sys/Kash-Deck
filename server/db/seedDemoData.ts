import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from './client';
import {
  users,
  workspaces,
  workspaceMembers,
  businessProfiles,
  userProfiles,
  accounts,
  transactions,
  dailySalesEntries,
  goals,
  customers
} from './schema';
import { seedDefaultCategories } from './seedCategories';

export async function seedDemoData() {
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Ensure default categories are seeded first
  await seedDefaultCategories();

  // 1. Create or check Primary Demo User (demo@cashdeck.ng)
  const existingDemo = await db.select().from(users).where(eq(users.email, 'demo@cashdeck.ng'));
  if (existingDemo.length === 0) {
    const demoUserId = 'usr_demo_cashdeck';
    await db.insert(users).values({
      id: demoUserId,
      email: 'demo@cashdeck.ng',
      phone: '+2348012345678',
      name: 'Ada Lovelace (Demo)',
      passwordHash,
      emailVerifiedAt: now,
      phoneVerifiedAt: now,
      activeWorkspaceId: 'ws_demo_personal',
      consentVersion: 'v1.0',
      consentAt: now,
      status: 'active',
      createdAt: now,
      updatedAt: now
    });

    await db.insert(userProfiles).values({
      id: 'prof_demo_cashdeck',
      userId: demoUserId,
      occupation: 'Tech Entrepreneur & Founder',
      financialFocus: JSON.stringify(['Wealth Tracking', 'Cash Flow', 'Business Separation']),
      incomeRegularity: 'Monthly & Irregular Dividends',
      expectedMonthlyIncomeMinor: 350000000,
      expectedMonthlyExpensesMinor: 180000000,
      createdAt: now,
      updatedAt: now
    });
  }

  // 2. Create or check Admin User (admin@cashdeck.ng)
  const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin@cashdeck.ng'));
  if (existingAdmin.length === 0) {
    const adminUserId = 'usr_admin_cashdeck';
    await db.insert(users).values({
      id: adminUserId,
      email: 'admin@cashdeck.ng',
      phone: '+2348098765432',
      name: 'CashDeck Administrator',
      passwordHash,
      emailVerifiedAt: now,
      phoneVerifiedAt: now,
      activeWorkspaceId: 'ws_demo_personal',
      consentVersion: 'v1.0',
      consentAt: now,
      status: 'active',
      createdAt: now,
      updatedAt: now
    });
  }

  // 3. Create or check demo@example.com (convenience alias)
  const existingExample = await db.select().from(users).where(eq(users.email, 'demo@example.com'));
  if (existingExample.length === 0) {
    await db.insert(users).values({
      id: 'usr_demo_example',
      email: 'demo@example.com',
      phone: '+2348012345679',
      name: 'Ada Lovelace',
      passwordHash,
      emailVerifiedAt: now,
      phoneVerifiedAt: now,
      activeWorkspaceId: 'ws_demo_personal',
      consentVersion: 'v1.0',
      consentAt: now,
      status: 'active',
      createdAt: now,
      updatedAt: now
    });
  }

  // 4. Create Personal Workspace
  const existingPersonalWs = await db.select().from(workspaces).where(eq(workspaces.id, 'ws_demo_personal'));
  if (existingPersonalWs.length === 0) {
    await db.insert(workspaces).values({
      id: 'ws_demo_personal',
      type: 'personal',
      name: 'Ada Personal Finances',
      currency: 'NGN',
      timezone: 'Africa/Lagos',
      ownerId: 'usr_demo_cashdeck',
      planId: 'free',
      onboardingStatus: 'completed',
      onboardingStep: 'done',
      isDemo: 1,
      settingsJson: JSON.stringify({ theme: 'light', currencySymbol: '₦' }),
      createdAt: now,
      updatedAt: now
    });
  }

  // 5. Create Business Workspace
  const existingBusinessWs = await db.select().from(workspaces).where(eq(workspaces.id, 'ws_demo_business'));
  if (existingBusinessWs.length === 0) {
    await db.insert(workspaces).values({
      id: 'ws_demo_business',
      type: 'business',
      name: 'Lovelace Retail Stores Ltd',
      currency: 'NGN',
      timezone: 'Africa/Lagos',
      ownerId: 'usr_demo_cashdeck',
      planId: 'free',
      onboardingStatus: 'completed',
      onboardingStep: 'done',
      isDemo: 1,
      settingsJson: JSON.stringify({ theme: 'light', currencySymbol: '₦' }),
      createdAt: now,
      updatedAt: now
    });

    await db.insert(businessProfiles).values({
      id: 'bprof_demo_business',
      workspaceId: 'ws_demo_business',
      legalName: 'Lovelace Retail & Trading Ltd',
      businessType: 'Retail & Supermarket',
      currentTrackingMethod: 'Cashbook & Daily Ledger',
      salesEntryMode: 'daily',
      featureProfile: JSON.stringify({ inventory: true, customers: true, suppliers: true, reconciliation: true }),
      expectedMonthlySalesMinor: 850000000,
      expectedMonthlyExpensesMinor: 520000000,
      rcNumber: 'RC-1849204',
      tin: 'TIN-99482910-0001',
      address: 'Plot 14 Admiralty Way, Lekki Phase 1, Lagos',
      isVatRegistered: 1,
      createdAt: now,
      updatedAt: now
    });
  }

  // 6. Ensure Workspace Memberships
  const allUserIds = ['usr_demo_cashdeck', 'usr_admin_cashdeck', 'usr_demo_example'];
  for (const uid of allUserIds) {
    const memPersonal = await db.select().from(workspaceMembers).where(eq(workspaceMembers.userId, uid));
    if (!memPersonal.some(m => m.workspaceId === 'ws_demo_personal')) {
      await db.insert(workspaceMembers).values({
        id: `mem_pers_${uid}`,
        workspaceId: 'ws_demo_personal',
        userId: uid,
        role: 'owner',
        createdAt: now
      });
    }
    if (!memPersonal.some(m => m.workspaceId === 'ws_demo_business')) {
      await db.insert(workspaceMembers).values({
        id: `mem_biz_${uid}`,
        workspaceId: 'ws_demo_business',
        userId: uid,
        role: 'owner',
        createdAt: now
      });
    }
  }

  // 7. Seed Accounts for Personal Workspace
  const existingAccounts = await db.select().from(accounts).where(eq(accounts.workspaceId, 'ws_demo_personal'));
  if (existingAccounts.length === 0) {
    await db.insert(accounts).values([
      {
        id: 'acc_demo_gtb',
        workspaceId: 'ws_demo_personal',
        type: 'bank',
        institution: 'GTBank',
        name: 'GTBank Premium Current',
        maskedNumber: '•••• 4821',
        currency: 'NGN',
        openingBalanceMinor: 210000000,
        currentBalanceMinor: 245000000,
        availableBalanceMinor: 245000000,
        includeInNetWorth: 1,
        isArchived: 0,
        lastSyncedAt: now,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'acc_demo_access',
        workspaceId: 'ws_demo_personal',
        type: 'bank',
        institution: 'Access Bank',
        name: 'Access Premier Checking',
        maskedNumber: '•••• 1934',
        currency: 'NGN',
        openingBalanceMinor: 85000000,
        currentBalanceMinor: 92000000,
        availableBalanceMinor: 92000000,
        includeInNetWorth: 1,
        isArchived: 0,
        lastSyncedAt: now,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'acc_demo_piggy',
        workspaceId: 'ws_demo_personal',
        type: 'fintech',
        institution: 'Piggyvest',
        name: 'Piggyvest Safelock',
        maskedNumber: '•••• 8820',
        currency: 'NGN',
        openingBalanceMinor: 150000000,
        currentBalanceMinor: 158000000,
        availableBalanceMinor: 158000000,
        includeInNetWorth: 1,
        isArchived: 0,
        lastSyncedAt: now,
        createdAt: now,
        updatedAt: now
      }
    ]);

    // Sample Personal Transactions
    await db.insert(transactions).values([
      {
        id: 'tx_demo_01',
        workspaceId: 'ws_demo_personal',
        accountId: 'acc_demo_gtb',
        occurredAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        amountMinor: 85000000,
        currency: 'NGN',
        description: 'Tech Consulting Client Retainer',
        classification: 'Personal',
        status: 'posted',
        source: 'bank',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'tx_demo_02',
        workspaceId: 'ws_demo_personal',
        accountId: 'acc_demo_gtb',
        occurredAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        amountMinor: -4500000,
        currency: 'NGN',
        description: 'Spar Supermarket Lekki',
        classification: 'Personal',
        status: 'posted',
        source: 'bank',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'tx_demo_03',
        workspaceId: 'ws_demo_personal',
        accountId: 'acc_demo_access',
        occurredAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        amountMinor: -2500000,
        currency: 'NGN',
        description: 'Eko Electricity Distribution (EKEDC)',
        classification: 'Personal',
        status: 'posted',
        source: 'bank',
        createdAt: now,
        updatedAt: now
      }
    ]);

    // Sample Goals
    await db.insert(goals).values([
      {
        id: 'goal_demo_emergency',
        workspaceId: 'ws_demo_personal',
        name: 'Emergency Buffer 6 Months',
        category: 'Emergency',
        targetAmountMinor: 300000000,
        currentAmountMinor: 158000000,
        targetDate: '2026-12-31',
        iconName: 'Shield',
        color: '#059669',
        status: 'active',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'goal_demo_invest',
        workspaceId: 'ws_demo_personal',
        name: 'Commercial Real Estate Pool',
        category: 'Investment',
        targetAmountMinor: 1000000000,
        currentAmountMinor: 350000000,
        targetDate: '2027-06-30',
        iconName: 'TrendingUp',
        color: '#0284c7',
        status: 'active',
        createdAt: now,
        updatedAt: now
      }
    ]);
  }

  // 8. Seed Accounts for Business Workspace
  const existingBizAccounts = await db.select().from(accounts).where(eq(accounts.workspaceId, 'ws_demo_business'));
  if (existingBizAccounts.length === 0) {
    await db.insert(accounts).values([
      {
        id: 'acc_demo_zenith_biz',
        workspaceId: 'ws_demo_business',
        type: 'bank',
        institution: 'Zenith Bank',
        name: 'Zenith Corporate Operations',
        maskedNumber: '•••• 7712',
        currency: 'NGN',
        openingBalanceMinor: 345000000,
        currentBalanceMinor: 412000000,
        availableBalanceMinor: 412000000,
        includeInNetWorth: 1,
        isArchived: 0,
        lastSyncedAt: now,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'acc_demo_opay_biz',
        workspaceId: 'ws_demo_business',
        type: 'fintech',
        institution: 'OPay',
        name: 'OPay POS Merchant Settlement',
        maskedNumber: '•••• 3390',
        currency: 'NGN',
        openingBalanceMinor: 62000000,
        currentBalanceMinor: 89000000,
        availableBalanceMinor: 89000000,
        includeInNetWorth: 1,
        isArchived: 0,
        lastSyncedAt: now,
        createdAt: now,
        updatedAt: now
      }
    ]);

    // Sample Daily Sales Entries
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    await db.insert(dailySalesEntries).values([
      {
        id: 'ds_demo_01',
        workspaceId: 'ws_demo_business',
        date: yesterday,
        totalSalesMinor: 38500000, // ₦385,000
        cashMinor: 7500000,
        transferMinor: 19000000,
        posMinor: 12000000,
        otherMinor: 0,
        transactionCount: 42,
        notes: 'Steady weekend retail sales across grocery & household sections',
        createdBy: 'usr_demo_cashdeck',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'ds_demo_02',
        workspaceId: 'ws_demo_business',
        date: today,
        totalSalesMinor: 29800000, // ₦298,000
        cashMinor: 5200000,
        transferMinor: 15400000,
        posMinor: 9200000,
        otherMinor: 0,
        transactionCount: 31,
        notes: 'Midweek sales, restocked beverages and FMCG items',
        createdBy: 'usr_demo_cashdeck',
        createdAt: now,
        updatedAt: now
      }
    ]);
  }

  // 9. Seed Business Customers
  const existingCust = await db.select().from(customers).where(eq(customers.workspaceId, 'ws_demo_business'));
  if (existingCust.length === 0) {
    await db.insert(customers).values([
      {
        id: 'cust-1',
        workspaceId: 'ws_demo_business',
        name: 'Alhaji Musa Dangote',
        phone: '+2348031234567',
        email: 'musa.dangote@example.ng',
        totalSalesMinor: 45000000,
        outstandingBalanceMinor: 12000000,
        salesCount: 8,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'cust-2',
        workspaceId: 'ws_demo_business',
        name: 'Mrs. Funke Akindele',
        phone: '+2348059876543',
        email: 'funke.akindele@example.ng',
        totalSalesMinor: 28000000,
        outstandingBalanceMinor: 0,
        salesCount: 5,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'cust-3',
        workspaceId: 'ws_demo_business',
        name: 'Chukwudi & Sons Ltd.',
        phone: '+2348023456789',
        email: 'chukwudi.sons@example.ng',
        totalSalesMinor: 85000000,
        outstandingBalanceMinor: 25000000,
        salesCount: 14,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'cust-4',
        workspaceId: 'ws_demo_business',
        name: 'Halima Bello Enterprises',
        phone: '+2348076543210',
        email: 'halima.bello@example.ng',
        totalSalesMinor: 15000000,
        outstandingBalanceMinor: 5000000,
        salesCount: 3,
        createdAt: now,
        updatedAt: now
      }
    ]);
  }

  console.log('[CashDeck DB] Demo and Admin seed data successfully verified.');
}
