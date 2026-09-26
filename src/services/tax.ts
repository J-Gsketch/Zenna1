import { Tenant } from '../../db.js';

export interface InvoiceItemInput {
  description: string;
  quantity?: number;
  unitPrice?: number;
  price?: number | string;
  amount?: number;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface BuyerDetails {
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  abn?: string;
  nzbn?: string;
  gstNumber?: string;
  [key: string]: any;
}

export interface TaxCalculationResult {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: 'AUD' | 'NZD';
}

export interface TaxInvoice {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  documentTitle: string;
  currency: 'AUD' | 'NZD';
  seller: {
    businessName: string;
    ownerName?: string;
    ownerPhone?: string;
    country_code: 'AU' | 'NZ';
    is_gst_registered: boolean;
    abn?: string;
    nzbn?: string;
    gst_number?: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  buyer?: BuyerDetails;
  isBuyerDetailsMandatory: boolean;
  headerDetails: {
    title: string;
    sellerABN?: string;
    sellerNZBN?: string;
    sellerGSTNumber?: string;
    mandatoryBuyerHeader?: {
      name: string;
      address?: string;
      phone?: string;
      email?: string;
    };
    [key: string]: any;
  };
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  complianceNotes: string[];
}

/**
 * Parses numeric currency amount from string or number
 */
export function parseAmount(val: number | string | undefined): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Calculates tax details based on tenant jurisdiction and GST registration status
 */
export function calculateTax(
  subtotal: number,
  tenant: Pick<Tenant, 'country_code' | 'is_gst_registered'>
): TaxCalculationResult {
  const currency: 'AUD' | 'NZD' = tenant.country_code === 'NZ' ? 'NZD' : 'AUD';

  if (!tenant.is_gst_registered) {
    return {
      subtotal: Number(subtotal.toFixed(2)),
      taxRate: 0,
      taxAmount: 0,
      total: Number(subtotal.toFixed(2)),
      currency
    };
  }

  const taxRate = tenant.country_code === 'NZ' ? 0.15 : 0.10;
  const taxAmount = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + taxAmount).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    taxRate,
    taxAmount,
    total,
    currency
  };
}

/**
 * Generates a compliant Tax Invoice according to Australian ATO and New Zealand IRD specifications.
 * 
 * Rules:
 * - If not GST registered: taxRate = 0, documentTitle = 'Invoice'
 * - If AU & GST registered: 10% GST, documentTitle = 'Tax Invoice', header includes ABN
 * - If NZ & GST registered: 15% GST, documentTitle = 'Taxable Supply Information / Tax Invoice', header includes GST Number & NZBN
 * - Mandatory Buyer details header if total >= $1,000
 */
export function generateTaxInvoice(
  tenant: Tenant,
  items: InvoiceItemInput[],
  buyer?: BuyerDetails,
  options?: { invoiceNumber?: string; issueDate?: string; dueDate?: string }
): TaxInvoice {
  const now = new Date();
  const invoiceNumber = options?.invoiceNumber || `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const issueDate = options?.issueDate || now.toISOString().split('T')[0];
  const due = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const dueDate = options?.dueDate || due.toISOString().split('T')[0];

  // Process line items
  const processedItems: InvoiceItem[] = items.map((item) => {
    const qty = item.quantity !== undefined ? item.quantity : 1;
    let unitPrice = 0;
    let amount = 0;

    if (item.amount !== undefined) {
      amount = parseAmount(item.amount);
      unitPrice = qty > 0 ? Number((amount / qty).toFixed(2)) : amount;
    } else if (item.unitPrice !== undefined) {
      unitPrice = parseAmount(item.unitPrice);
      amount = Number((unitPrice * qty).toFixed(2));
    } else if (item.price !== undefined) {
      const p = parseAmount(item.price);
      unitPrice = p;
      amount = Number((p * qty).toFixed(2));
    }

    return {
      description: item.description,
      quantity: qty,
      unitPrice,
      amount
    };
  });

  const subtotal = Number(processedItems.reduce((sum, item) => sum + item.amount, 0).toFixed(2));
  const taxCalc = calculateTax(subtotal, tenant);
  const { taxRate, taxAmount, total, currency } = taxCalc;

  // Document Title & Headers Determination
  let documentTitle = 'Invoice';
  const headerDetails: TaxInvoice['headerDetails'] = {
    title: ''
  };
  const complianceNotes: string[] = [];

  if (!tenant.is_gst_registered) {
    documentTitle = 'Invoice';
    headerDetails.title = 'Invoice';
    complianceNotes.push('Issuer is not registered for GST. No GST has been charged.');
  } else if (tenant.country_code === 'AU') {
    documentTitle = 'Tax Invoice';
    headerDetails.title = 'Tax Invoice';
    if (tenant.abn) {
      headerDetails.sellerABN = tenant.abn;
    }
    complianceNotes.push('Australian GST included at 10.0%. Meets ATO Tax Invoice criteria.');
  } else if (tenant.country_code === 'NZ') {
    documentTitle = 'Taxable Supply Information / Tax Invoice';
    headerDetails.title = 'Taxable Supply Information / Tax Invoice';
    if (tenant.gst_number) {
      headerDetails.sellerGSTNumber = tenant.gst_number;
    }
    if (tenant.nzbn) {
      headerDetails.sellerNZBN = tenant.nzbn;
    }
    complianceNotes.push('New Zealand GST included at 15.0%. Compliant with IRD Taxable Supply Information requirements.');
  }

  // Mandatory Buyer details rule (>= $1,000)
  const isBuyerDetailsMandatory = total >= 1000;
  if (isBuyerDetailsMandatory) {
    if (buyer && buyer.name) {
      headerDetails.mandatoryBuyerHeader = {
        name: buyer.name,
        address: buyer.address,
        phone: buyer.phone,
        email: buyer.email
      };
      complianceNotes.push('Mandatory recipient/buyer details included (Total exceeds $1,000 threshold).');
    } else {
      complianceNotes.push('WARNING: Total exceeds $1,000 threshold — buyer details are legally required for tax compliance.');
    }
  }

  return {
    invoiceNumber,
    issueDate,
    dueDate,
    documentTitle,
    currency,
    seller: {
      businessName: tenant.businessName || 'Trading Entity',
      ownerName: tenant.ownerName,
      ownerPhone: tenant.ownerPhone || tenant.phoneNumber,
      country_code: tenant.country_code,
      is_gst_registered: tenant.is_gst_registered,
      abn: tenant.abn,
      nzbn: tenant.nzbn,
      gst_number: tenant.gst_number,
      address: tenant.address,
      email: tenant.email,
      phone: tenant.phoneNumber || tenant.ownerPhone
    },
    buyer,
    isBuyerDetailsMandatory,
    headerDetails,
    items: processedItems,
    subtotal,
    taxRate,
    taxAmount,
    total,
    complianceNotes
  };
}
