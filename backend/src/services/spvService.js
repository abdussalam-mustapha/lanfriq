import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SPVDocument } from '../models/index.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SPVService {
  constructor() {
    this.outputDir = path.join(__dirname, '../../uploads/spv-documents');
    this.ensureOutputDir();
  }

  async ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  // Generate SPV Document
  async generateSPVDocument(propertyData, ownerData) {
    try {
      const filename = `SPV-${Date.now()}-${propertyData._id}.pdf`;
      const filepath = path.join(this.outputDir, filename);

      // Create PDF document
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const writeStream = fs.createWriteStream(filepath);
      doc.pipe(writeStream);

      // Add content to PDF
      this.addHeader(doc);
      this.addSPVDetails(doc, propertyData, ownerData);
      this.addPropertyDetails(doc, propertyData);
      this.addShareholderInfo(doc, ownerData);
      this.addLegalDisclaimer(doc);
      this.addFooter(doc);

      // Finalize PDF
      doc.end();

      // Wait for write to complete
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      logger.info(`SPV document generated: ${filename}`);

      return {
        filename,
        filepath,
        url: `/uploads/spv-documents/${filename}`,
      };
    } catch (error) {
      logger.error(`Error generating SPV document: ${error.message}`);
      throw error;
    }
  }

  addHeader(doc) {
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('SPECIAL PURPOSE VEHICLE', { align: 'center' })
      .fontSize(16)
      .text('Property Tokenization Agreement', { align: 'center' })
      .moveDown(2);
  }

  addSPVDetails(doc, propertyData, ownerData) {
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('SPV Information', { underline: true })
      .moveDown(0.5)
      .fontSize(11)
      .font('Helvetica');

    const spvName = `${propertyData.title.replace(/[^a-zA-Z0-9]/g, '_')}_SPV`;
    const docNumber = `SPV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`;

    doc
      .text(`Document Number: ${docNumber}`)
      .text(`SPV Name: ${spvName}`)
      .text(`Formation Date: ${new Date().toLocaleDateString()}`)
      .text(`Jurisdiction: Blockchain-Based (Camp Network)`)
      .moveDown(1.5);
  }

  addPropertyDetails(doc, propertyData) {
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Property Details', { underline: true })
      .moveDown(0.5)
      .fontSize(11)
      .font('Helvetica');

    doc
      .text(`Property Title: ${propertyData.title}`)
      .text(`Property Type: ${propertyData.propertyType}`)
      .text(`Location: ${propertyData.location.address}, ${propertyData.location.city}, ${propertyData.location.country}`)
      .text(`Valuation: $${propertyData.valuation.amount.toLocaleString()} ${propertyData.valuation.currency}`)
      .text(`Total Shares: ${propertyData.tokenization.totalShares || 'TBD'}`)
      .text(`Share Price: $${propertyData.tokenization.sharePrice || 'TBD'}`)
      .moveDown(1.5);
  }

  addShareholderInfo(doc, ownerData) {
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Initial Shareholder Information', { underline: true })
      .moveDown(0.5)
      .fontSize(11)
      .font('Helvetica');

    doc
      .text(`Wallet Address: ${ownerData.walletAddress}`)
      .text(`Name: ${ownerData.username || 'Not Provided'}`)
      .text(`Initial Ownership: 100%`)
      .moveDown(1.5);
  }

  addLegalDisclaimer(doc) {
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Legal Disclaimer', { underline: true })
      .moveDown(0.5)
      .fontSize(9)
      .font('Helvetica');

    const disclaimer = `This Special Purpose Vehicle (SPV) document represents the tokenization of real estate property on the blockchain. By holding shares of this SPV, shareholders agree to the following:

1. Shareholders acknowledge that this is a blockchain-based asset and all transactions are recorded on-chain.
2. The property is managed according to smart contract rules deployed on Camp Network.
3. Share ownership is represented by NFT tokens and can be transferred according to platform rules.
4. All shareholders are subject to applicable laws and regulations in their jurisdiction.
5. This document does not constitute financial or investment advice.
6. Past performance is not indicative of future results.
7. All investments carry risk, including the risk of loss of principal.

This document is generated electronically and does not require a physical signature. The blockchain transaction hash serves as proof of agreement to these terms.`;

    doc.text(disclaimer, { align: 'justify' });
    doc.moveDown(1);
  }

  addFooter(doc) {
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      
      doc
        .fontSize(9)
        .text(
          `Generated by Lanfriq Platform | ${new Date().toLocaleDateString()} | Page ${i + 1} of ${pages.count}`,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );
    }
  }

  // Create SPV document record in database
  async createSPVRecord(propertyId, ownerId, documentUrl, documentHash) {
    try {
      const property = await Property.findById(propertyId);
      
      const spvDoc = await SPVDocument.create({
        property: propertyId,
        owner: ownerId,
        documentUrl,
        documentHash,
        propertySnapshot: {
          title: property.title,
          address: property.location.address,
          valuation: property.valuation.amount,
          totalShares: property.tokenization.totalShares,
          sharePrice: property.tokenization.sharePrice,
        },
        status: 'generated',
      });

      logger.info(`SPV record created: ${spvDoc._id} for property ${propertyId}`);
      return spvDoc;
    } catch (error) {
      logger.error(`Error creating SPV record: ${error.message}`);
      throw error;
    }
  }
}

const spvService = new SPVService();

export default spvService;
