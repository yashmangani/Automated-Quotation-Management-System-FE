// // // ============================================
// // // PDF Generator Utility Functions - FIXED VERSION
// // // ============================================

// // const toBase64 = async (imageUrl: string): Promise<string> => {
// //   try {
// //     if (!imageUrl) return '';
// //     if (imageUrl.startsWith('data:')) return imageUrl;
    
// //     const response = await fetch(imageUrl, { mode: 'cors' });
// //     const blob = await response.blob();
    
// //     return new Promise((resolve, reject) => {
// //       const reader = new FileReader();
// //       reader.onloadend = () => resolve(reader.result as string);
// //       reader.onerror = reject;
// //       reader.readAsDataURL(blob);
// //     });
// //   } catch (error) {
// //     console.warn('Image conversion failed:', error);
// //     return '';
// //   }
// // };

// // const numberToWords = (num: number): string => {
// //   const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
// //   const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
// //   const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

// //   if (num === 0) return "Zero";

// //   const convert = (n: number): string => {
// //     if (n < 10) return ones[n];
// //     if (n < 20) return teens[n - 10];
// //     if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
// //     return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
// //   };

// //   if (num < 1000) return convert(num);
// //   if (num < 100000) return `${convert(Math.floor(num / 1000))} Thousand ${convert(num % 1000)}`.trim();
// //   if (num < 10000000) return `${convert(Math.floor(num / 100000))} Lakh ${convert(num % 100000)}`.trim();
// //   return `${convert(Math.floor(num / 10000000))} Crore ${convert(num % 10000000)}`.trim();
// // };

// // const formatCurrency = (value: number): string => value.toFixed(2);

// // const formatDate = (date: any): string => {
// //   return new Date(date).toLocaleDateString("en-GB", {
// //     day: '2-digit',
// //     month: 'short',
// //     year: 'numeric'
// //   });
// // };

// // // Load html2pdf library dynamically
// // const loadHtml2PdfScript = (): Promise<void> => {
// //   return new Promise((resolve, reject) => {
// //     if (typeof (window as any).html2pdf !== 'undefined') {
// //       resolve();
// //       return;
// //     }

// //     const script = document.createElement('script');
// //     script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
// //     script.onload = () => {
// //       console.log('✅ html2pdf library loaded');
// //       resolve();
// //     };
// //     script.onerror = () => reject(new Error('Failed to load html2pdf library'));
// //     document.head.appendChild(script);
// //   });
// // };

// // // Wait for all images to load
// // const waitForImages = (element: HTMLElement): Promise<void> => {
// //   const images = element.querySelectorAll('img');
// //   if (images.length === 0) return Promise.resolve();

// //   const promises = Array.from(images).map(img => {
// //     if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
    
// //     return new Promise<void>((resolve) => {
// //       const timeout = setTimeout(() => {
// //         console.warn('Image load timeout:', img.src);
// //         resolve();
// //       }, 5000);

// //       img.onload = () => {
// //         clearTimeout(timeout);
// //         resolve();
// //       };
// //       img.onerror = () => {
// //         clearTimeout(timeout);
// //         console.warn('Image load error:', img.src);
// //         resolve();
// //       };
// //     });
// //   });

// //   return Promise.all(promises).then(() => {});
// // };

// // // ============================================
// // // Main PDF Generation Function
// // // ============================================

// // export const handleDownloadPDF = async (
// //   product: any,
// //   setDownloadingPdfId: (id: string | null) => void,
// //   setPdfCustomerName: (name: string) => void,
// //   setShowPdfModal: (show: boolean) => void,
// //   setPdfProgress: (progress: string) => void,
// //   showToast: (message: string, type: string) => void
// // ) => {
// //   let element: HTMLElement | null = null;
  
// //   try {
// //     // Validation
// //     if (!product.items || product.items.length === 0) {
// //       showToast("Cannot generate PDF: No items in quotation", "error");
// //       return;
// //     }

// //     // Set loading state
// //     setDownloadingPdfId(product._id);
// //     setPdfCustomerName(product.name);
// //     setShowPdfModal(true);
// //     setPdfProgress("Loading PDF library...");

// //     console.log('📥 Starting PDF generation for:', product.name);

// //     // Load html2pdf library
// //     await loadHtml2PdfScript();

// //     // Calculate values
// //     const discountPercent = parseFloat(product.dis) || 0;
// //     const isNRP = product.value === 'nrp';
// //     const isMRP = product.value === 'mrp';
// //     const isManual = product.value === 'manual';
// //     const includeGst = product.includeGst === true;

// //     // Logo
// //     const logoBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5SVDwvdGV4dD48L3N2Zz4=';

// //     // Process items with images
// //     setPdfProgress("Processing items and images...");
// //     console.log(`📦 Processing ${product.items?.length || 0} items...`);

// //     const itemsWithImages = await Promise.all(
// //       (product.items || []).map(async (itemEntry: any, index: number) => {
// //         const item = itemEntry.item || itemEntry;
// //         if (!item) return null;

// //         let rate = 0;
// //         if (isManual) {
// //           rate = itemEntry.manualPrice || 0;
// //         } else if (isNRP) {
// //           rate = parseFloat(item.nrp) || 0;
// //         } else if (isMRP) {
// //           rate = parseFloat(item.mrp) || 0;
// //         }

// //         const qty = parseFloat(itemEntry.quantity) || 1;
// //         const amount = rate * qty;

// //         const base64 = item.image ? await toBase64(item.image) : '';

// //         return {
// //           serialNo: index + 1,
// //           name: item.name || 'N/A',
// //           description: item.description || '',
// //           code: item._id?.toString().slice(-8).toUpperCase() || '',
// //           rate,
// //           qty,
// //           amount,
// //           base64
// //         };
// //       })
// //     );

// //     const validItems = itemsWithImages.filter(item => item !== null);
// //     console.log(`✅ Processed ${validItems.length} valid items`);

// //     // Calculate totals
// //     setPdfProgress("Calculating totals...");
// //     const othersTotal = validItems.reduce((sum, item) => sum + item.amount, 0);
// //     const totalAmount = othersTotal;
// //     const netAmount = othersTotal;
// //     const totalWithoutDiscount = othersTotal / (1 - discountPercent / 100);
// //     const cgst = includeGst ? (othersTotal * 0.09) : 0;
// //     const sgst = includeGst ? (othersTotal * 0.09) : 0;
// //     const totalAmountWithGst = othersTotal + cgst + sgst;
// //     const roundOff = Math.round(totalAmountWithGst) - totalAmountWithGst;
// //     const finalAmount = Math.round(totalAmountWithGst);

// //     // Generate item rows
// //     const generateItemRows = () => validItems.map(item => `
// //       <tr>
// //         <td class="text-center">${item.serialNo}</td>
// //         <td class="text-left">
// //           <strong>${item.name}</strong>
// //           ${item.description ? `<br><span style="font-size: 9px; color: #666;">${item.description}</span>` : ''}
// //         </td>
// //         <td class="text-center">${item.code || '-'}</td>
// //         <td class="text-center">
// //           ${item.base64 ? `<img src="${item.base64}" class="item-image" alt="${item.name}">` : ''}
// //         </td>
// //         <td class="text-right">${formatCurrency(item.rate)}</td>
// //         <td class="text-center">${formatCurrency(item.qty)}</td>
// //         <td class="text-right">${formatCurrency(discountPercent)}</td>
// //         <td class="text-right">${formatCurrency(item.amount)}</td>
// //       </tr>
// //     `).join('');

// //     // Generate HTML
// //     setPdfProgress("Generating PDF document...");
// //     const html = `<!DOCTYPE html>
// // <html lang="en">
// // <head>
// //     <meta charset="UTF-8">
// //     <title>Quotation - ${product.name || 'Customer'}</title>
// //     <style>
// //         * { margin: 0; padding: 0; box-sizing: border-box; }
// //         body { 
// //             font-family: Arial, sans-serif; 
// //             font-size: 10px; 
// //             line-height: 1.3; 
// //             color: #000; 
// //             background: white;
// //             width: 210mm;
// //             padding: 10mm;
// //         }
// //         .header { border: 2px solid #000; padding: 10px; margin-bottom: 2px; }
// //         .header-top { display: flex; justify-content: space-between; margin-bottom: 10px; align-items: flex-start; }
// //         .logo-section { width: 80px; margin-right: 15px; flex-shrink: 0; }
// //         .logo-box { width: 70px; height: 70px; border: 2px solid #000; display: flex; align-items: center; justify-content: center; background: #f5f5f5; }
// //         .logo-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
// //         .company-info { flex: 1; min-width: 0; }
// //         .company-name { font-size: 18px; font-weight: bold; margin-bottom: 3px; }
// //         .company-address { font-size: 9px; line-height: 1.4; }
// //         .header-right { width: 200px; text-align: right; flex-shrink: 0; }
// //         .quotation-title { text-align: center; font-size: 16px; font-weight: bold; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 5px 0; margin: 10px 0; }
// //         .header-info { display: flex; justify-content: space-between; gap: 10px; }
// //         .header-left, .header-right-info { width: 48%; }
// //         .info-line { font-size: 9px; margin-bottom: 3px; }
// //         .items-section { border: 2px solid #000; border-top: none; }
// //         .section-header { background: #f0f0f0; padding: 5px; font-weight: bold; font-size: 10px; border-bottom: 1px solid #000; text-align: center; }
// //         table { width: 100%; border-collapse: collapse; }
// //         th { background: #f0f0f0; padding: 6px 4px; border: 1px solid #000; text-align: center; font-weight: bold; font-size: 9px; }
// //         td { padding: 6px 4px; border: 1px solid #000; vertical-align: middle; font-size: 9px; }
// //         .text-left { text-align: left; padding-left: 8px; }
// //         .text-right { text-align: right; padding-right: 8px; }
// //         .text-center { text-align: center; }
// //         .item-image { width: 60px; height: 60px; object-fit: contain; display: block; margin: 0 auto; }
// //         .summary-section { border: 2px solid #000; border-top: none; padding: 10px; }
// //         .summary-table { width: 100%; margin-bottom: 10px; }
// //         .summary-table td { padding: 4px 8px; border: 1px solid #000; font-size: 9px; }
// //         .summary-label { font-weight: bold; background: #f0f0f0; }
// //         .final-amount-label, .final-amount-value { font-weight: bold; font-size: 11px; padding: 8px; background: #000; color: white; }
// //         .terms-section { border: 2px solid #000; padding: 10px; margin-top: 10px; }
// //         .terms-title { font-weight: bold; font-size: 11px; margin-bottom: 8px; text-decoration: underline; }
// //         .terms-list { font-size: 9px; padding-left: 20px; line-height: 1.5; }
// //         .terms-list li { margin-bottom: 4px; }
// //         .brands-section { border: 2px solid #000; border-top: none; padding: 15px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; align-items: center; justify-items: center; }
// //         .brand-item { text-align: center; font-weight: bold; font-size: 10px; }
// //         .footer { border: 2px solid #000; border-top: none; padding: 25px 10px 10px; text-align: right; font-size: 9px; }
// //     </style>
// // </head>
// // <body>
// //     <div class="header">
// //         <div class="header-top">
// //             <div class="logo-section">
// //                 <div class="logo-box">
// //                     <img src="${logoBase64}" alt="Logo">
// //                 </div>
// //             </div>
// //             <div class="company-info">
// //                 <div class="company-name">Raj TILES</div>
// //                 <div class="company-address">
// //                     JAL CHHAYA ROW HOUSE, SATELLITE ROAD,<br>
// //                     PUNA, MOTA VARACHHA<br>
// //                     Surat Gujarat - 394101<br>
// //                     98255 32006
// //                 </div>
// //             </div>
// //             <div class="header-right">
// //                 <div style="font-size: 10px; margin-bottom: 5px;"><strong>Original</strong></div>
// //                 <div class="info-line"><strong>Quotation No:</strong> ${product._id?.toString().slice(-8).toUpperCase()}</div>
// //                 <div class="info-line"><strong>Date:</strong> ${formatDate(product.date)}</div>
// //                 <div class="info-line"><strong>Validity:</strong> ${formatDate(new Date(product.date).getTime() + 15 * 24 * 60 * 60 * 1000)}</div>
// //             </div>
// //         </div>
// //         <div class="quotation-title">Quotation</div>
// //         <div class="header-info">
// //             <div class="header-left">
// //                 <div style="font-weight: bold; margin-bottom: 5px; font-size: 10px;">Buyer (Bill To):</div>
// //                 <div class="info-line"><strong>${product.name || 'CUSTOMER'}</strong></div>
// //                 <div class="info-line">${product.address || 'Surat, Gujarat'}</div>
// //                 <div class="info-line"><strong>State:</strong> Gujarat, Code: 24</div>
// //                 <div class="info-line"><strong>M:</strong> ${product.number || '0000000000'}</div>
// //             </div>
// //             <div class="header-right-info">
// //                 <div style="font-weight: bold; margin-bottom: 5px; font-size: 10px;">Consignee (Ship To):</div>
// //                 <div class="info-line"><strong>${product.consigneeName || product.name || 'CUSTOMER'}</strong></div>
// //                 <div class="info-line">${product.consigneeAddress || product.address || 'Surat, Gujarat'}</div>
// //                 <div class="info-line"><strong>State:</strong> Gujarat, Code: 24</div>
// //                 <div class="info-line"><strong>M:</strong> ${product.consigneeMobile || product.number || '0000000000'}</div>
// //             </div>
// //         </div>
// //     </div>
// //     <div class="items-section">
// //         <div class="section-header">Items</div>
// //         <table>
// //             <thead>
// //                 <tr>
// //                     <th style="width: 5%;">SR.NO</th>
// //                     <th style="width: 30%;">DESCRIPTION</th>
// //                     <th style="width: 10%;">SKU CODE</th>
// //                     <th style="width: 13%;">IMAGE</th>
// //                     <th style="width: 10%;">PRICE</th>
// //                     <th style="width: 10%;">QTY</th>
// //                     <th style="width: 10%;">DISC%</th>
// //                     <th style="width: 12%;">AMOUNT</th>
// //                 </tr>
// //             </thead>
// //             <tbody>${generateItemRows()}</tbody>
// //         </table>
// //     </div>
// //     <div class="summary-section">
// //         <table class="summary-table">
// //             <tr style="border-bottom: 2px solid #000;">
// //                 <td colspan="2" style="border: none; padding: 4px; font-weight: bold;">Total</td>
// //                 <td style="border: none;"></td>
// //                 <td style="border: none; text-align: right; font-weight: bold;">Others + Total Amount</td>
// //                 <td style="border: none; text-align: right; font-weight: bold;">${formatCurrency(othersTotal)}</td>
// //             </tr>
// //         </table>
// //         <table class="summary-table">
// //             <tr>
// //                 <td class="summary-label" style="width: 30%;">SR. NO.</td>
// //                 <td class="summary-label" style="text-align: center;">AREA</td>
// //                 <td colspan="3" class="summary-label" style="text-align: center;">NET AMOUNT</td>
// //             </tr>
// //             <tr>
// //                 <td class="text-center">26</td>
// //                 <td class="text-center">Others</td>
// //                 <td colspan="3" class="text-right">${formatCurrency(othersTotal)}</td>
// //             </tr>
// //             <tr>
// //                 <td colspan="2" class="summary-label">Total Amount</td>
// //                 <td colspan="3" class="text-right" style="font-weight: bold;">${formatCurrency(totalAmount)}</td>
// //             </tr>
// //             <tr>
// //                 <td colspan="2" class="summary-label">Net Amount</td>
// //                 <td colspan="3" class="text-right" style="font-weight: bold;">${formatCurrency(netAmount)}</td>
// //             </tr>
// //             <tr>
// //                 <td colspan="2" class="text-right">Total without Discount:</td>
// //                 <td colspan="3" class="text-right">${formatCurrency(totalWithoutDiscount)}</td>
// //             </tr>
// //             ${includeGst ? `
// //             <tr>
// //                 <td colspan="2" class="text-right">CGST (9%):</td>
// //                 <td colspan="3" class="text-right">${formatCurrency(cgst)}</td>
// //             </tr>
// //             <tr>
// //                 <td colspan="2" class="text-right">SGST (9%):</td>
// //                 <td colspan="3" class="text-right">${formatCurrency(sgst)}</td>
// //             </tr>
// //             ` : ''}
// //             <tr>
// //                 <td colspan="2" class="text-right">Total Amount:</td>
// //                 <td colspan="3" class="text-right">${formatCurrency(totalAmountWithGst)}</td>
// //             </tr>
// //             <tr>
// //                 <td colspan="2" class="text-right">Round Off:</td>
// //                 <td colspan="3" class="text-right">${formatCurrency(roundOff)}</td>
// //             </tr>
// //             <tr>
// //                 <td colspan="2" class="final-amount-label">Final Amount:</td>
// //                 <td colspan="3" class="final-amount-value">${formatCurrency(finalAmount)}</td>
// //             </tr>
// //         </table>
// //         <div style="margin-top: 10px; font-size: 8px;">
// //             <strong>Amount in words:</strong> ${numberToWords(finalAmount)} Rupees Only
// //         </div>
// //         <div style="font-size: 8px; margin-top: 8px; color: #666;">
// //             Please find below items are also available please contact for further details.
// //         </div>
// //     </div>
// //     <div class="terms-section">
// //         <div class="terms-title">Terms & Conditions:</div>
// //         <ul class="terms-list">
// //             <li>No return policy – Sold goods will not be taken back.</li>
// //             <li>Free delivery on truckload orders.</li>
// //             <li>Delivery orders must be placed at least 15 days in advance.</li>
// //             <li>Only Cash Rate.</li>
// //         </ul>
// //     </div>
// //     <div class="brands-section">
// //         <div class="brand-item" style="font-style: italic; color: #2d5555;">Jaquar</div>
// //         <div class="brand-item" style="font-size: 12px;">kerakoll</div>
// //         <div class="brand-item" style="color: #d32f2f;">Roff<br><span style="font-size: 7px; color: #555;">PREVENT • PROTECT • PRESERVE</span></div>
// //         <div class="brand-item">
// //             <div style="width: 40px; height: 40px; border: 2px solid #333; border-radius: 50%; display: flex; align-items: center; justify-center;">
// //                 <span style="font-size: 18px;">S</span>
// //             </div>
// //         </div>
// //         <div class="brand-item">simola<br><span style="font-size: 7px;">VITRIFIED TILES</span></div>
// //         <div class="brand-item" style="font-size: 12px;">SEGA<br><span style="font-size: 7px;">TILES</span></div>
// //         <div class="brand-item" style="background: #1565c0; color: white; padding: 6px 10px; border-radius: 4px; font-size: 9px;">MYK LATICRETE</div>
// //         <div class="brand-item" style="color: #c89860;">SONARA<br><span style="font-size: 7px;">SANITARY WARES</span></div>
// //         <div class="brand-item" style="background: #2d2d2d; color: white; padding: 6px 10px; border-radius: 4px;">Wintouch</div>
// //         <div class="brand-item" style="background: #2d2d2d; color: white; padding: 6px 10px; border-radius: 4px; font-size: 11px;">AGILIS</div>
// //         <div class="brand-item" style="color: #1a5490; font-size: 12px;">LEMZON<br><span style="font-size: 7px; color: #555;">empire of tiles</span></div>
// //         <div class="brand-item" style="color: #c62828; font-size: 12px;">LEZORA<br><span style="font-size: 7px; color: #555;">empire of tiles</span></div>
// //     </div>
// //     <div class="footer">
// //         <div style="margin-bottom: 45px; text-align: right;">
// //             For <strong>RAJ TILES</strong>
// //         </div>
// //         <div style="border-top: 1px solid #000; padding-top: 5px; text-align: right;">
// //             <strong>Authorized Signatory</strong>
// //         </div>
// //         <div style="margin-top: 10px; text-align: left; font-size: 8px;">
// //             <strong>Prepared By:</strong> CHARMI VORA
// //         </div>
// //     </div>
// // </body>
// // </html>`;

// //     // Create element - MUST BE VISIBLE
// //     setPdfProgress("Preparing document for rendering...");
// //     element = document.createElement('div');
// //     element.innerHTML = html;
// //     element.id = 'pdf-generator-container';
    
// //     // CRITICAL: Style for visibility
// //     element.style.position = 'fixed';
// //     element.style.top = '0';
// //     element.style.left = '0';
// //     element.style.width = '210mm';
// //     element.style.minHeight = '297mm';
// //     element.style.background = 'white';
// //     element.style.zIndex = '99999';
// //     element.style.overflow = 'visible';
    
// //     document.body.appendChild(element);
// //     console.log('📄 Element added to DOM');

// //     // Wait for rendering
// //     setPdfProgress("Loading images and content...");
// //     await new Promise(resolve => setTimeout(resolve, 300));
// //     await waitForImages(element);
// //     await new Promise(resolve => setTimeout(resolve, 800));
    
// //     console.log('✅ Content ready, dimensions:', {
// //       width: element.offsetWidth,
// //       height: element.offsetHeight,
// //       scrollWidth: element.scrollWidth,
// //       scrollHeight: element.scrollHeight
// //     });

// //     // Generate PDF
// //     setPdfProgress("Converting to PDF...");
// //     const opt = {
// //       margin: 0,
// //       filename: `Quotation_${product.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
// //       image: { type: 'jpeg', quality: 0.95 },
// //       html2canvas: { 
// //         scale: 2,
// //         useCORS: true,
// //         allowTaint: true,
// //         logging: false,
// //         backgroundColor: '#ffffff',
// //         windowWidth: element.scrollWidth,
// //         windowHeight: element.scrollHeight
// //       },
// //       jsPDF: { 
// //         unit: 'mm', 
// //         format: 'a4', 
// //         orientation: 'portrait'
// //       }
// //     };

// //     console.log('🎨 Starting PDF conversion...');
// //     await (window as any).html2pdf().set(opt).from(element).save();
// //     console.log('✅ PDF generated successfully');

// //     // Cleanup
// //     if (element && element.parentNode) {
// //       document.body.removeChild(element);
// //     }

// //     setShowPdfModal(false);
// //     setTimeout(() => {
// //       showToast(`PDF downloaded: ${opt.filename}`, "success");
// //     }, 300);

// //   } catch (error: any) {
// //     console.error('❌ PDF generation error:', error);
// //     setShowPdfModal(false);
// //     setTimeout(() => {
// //       showToast(`Failed to generate PDF: ${error.message}`, "error");
// //     }, 300);
// //   } finally {
// //     if (element && element.parentNode) {
// //       try {
// //         document.body.removeChild(element);
// //       } catch (e) {
// //         console.warn('Cleanup warning:', e);
// //       }
// //     }
// //     setDownloadingPdfId(null);
// //   }
// // };

// // ============================================
// // PDF Generator - FIXED VERSION with jsPDF
// // ============================================

// const toBase64 = async (imageUrl: string): Promise<string> => {
//   try {
//     if (!imageUrl) return '';
//     if (imageUrl.startsWith('data:')) return imageUrl;
    
//     const response = await fetch(imageUrl, { mode: 'cors' });
//     const blob = await response.blob();
    
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   } catch (error) {
//     console.warn('Image conversion failed:', error);
//     return '';
//   }
// };

// const numberToWords = (num: number): string => {
//   const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
//   const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
//   const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

//   if (num === 0) return "Zero";

//   const convert = (n: number): string => {
//     if (n < 10) return ones[n];
//     if (n < 20) return teens[n - 10];
//     if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
//     return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
//   };

//   if (num < 1000) return convert(num);
//   if (num < 100000) return `${convert(Math.floor(num / 1000))} Thousand ${convert(num % 1000)}`.trim();
//   if (num < 10000000) return `${convert(Math.floor(num / 100000))} Lakh ${convert(num % 100000)}`.trim();
//   return `${convert(Math.floor(num / 10000000))} Crore ${convert(num % 10000000)}`.trim();
// };

// const formatCurrency = (value: number): string => value.toFixed(2);

// const formatDate = (date: any): string => {
//   return new Date(date).toLocaleDateString("en-GB", {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   });
// };

// // Load jsPDF and autoTable
// const loadJsPDFLibraries = (): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     // Check if already loaded
//     if (typeof (window as any).jspdf !== 'undefined') {
//       resolve();
//       return;
//     }

//     // Load jsPDF
//     const jspdfScript = document.createElement('script');
//     jspdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
//     jspdfScript.onload = () => {
//       console.log('✅ jsPDF loaded');
      
//       // Load autoTable plugin
//       const autoTableScript = document.createElement('script');
//       autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
//       autoTableScript.onload = () => {
//         console.log('✅ jsPDF autoTable plugin loaded');
//         resolve();
//       };
//       autoTableScript.onerror = () => reject(new Error('Failed to load autoTable'));
//       document.head.appendChild(autoTableScript);
//     };
//     jspdfScript.onerror = () => reject(new Error('Failed to load jsPDF'));
//     document.head.appendChild(jspdfScript);
//   });
// };

// // ============================================
// // Main PDF Generation Function
// // ============================================

// export const handleDownloadPDF = async (
//   product: any,
//   setDownloadingPdfId: (id: string | null) => void,
//   setPdfCustomerName: (name: string) => void,
//   setShowPdfModal: (show: boolean) => void,
//   setPdfProgress: (progress: string) => void,
//   showToast: (message: string, type: string) => void
// ) => {
//   try {
//     // Validation
//     if (!product.items || product.items.length === 0) {
//       showToast("Cannot generate PDF: No items in quotation", "error");
//       return;
//     }

//     // Set loading state
//     setDownloadingPdfId(product._id);
//     setPdfCustomerName(product.name);
//     setShowPdfModal(true);
//     setPdfProgress("Loading PDF library...");

//     console.log('📥 Starting PDF generation for:', product.name);

//     // Load jsPDF libraries
//     await loadJsPDFLibraries();

//     // Calculate values
//     const discountPercent = parseFloat(product.dis) || 0;
//     const isNRP = product.value === 'nrp';
//     const isMRP = product.value === 'mrp';
//     const isManual = product.value === 'manual';
//     const includeGst = product.includeGst === true;

//     // Process items with images
//     setPdfProgress("Processing items and images...");
//     console.log(`📦 Processing ${product.items?.length || 0} items...`);

//     const itemsWithImages = await Promise.all(
//       (product.items || []).map(async (itemEntry: any, index: number) => {
//         const item = itemEntry.item || itemEntry;
//         if (!item) return null;

//         let rate = 0;
//         if (isManual) {
//           rate = itemEntry.manualPrice || 0;
//         } else if (isNRP) {
//           rate = parseFloat(item.nrp) || 0;
//         } else if (isMRP) {
//           rate = parseFloat(item.mrp) || 0;
//         }

//         const qty = parseFloat(itemEntry.quantity) || 1;
//         const amount = rate * qty;

//         const base64 = item.image ? await toBase64(item.image) : '';

//         return {
//           serialNo: index + 1,
//           name: item.name || 'N/A',
//           description: item.description || '',
//           code: item._id?.toString().slice(-8).toUpperCase() || '',
//           rate,
//           qty,
//           amount,
//           base64
//         };
//       })
//     );

//     const validItems = itemsWithImages.filter(item => item !== null);
//     console.log(`✅ Processed ${validItems.length} valid items`);

//     // Calculate totals
//     setPdfProgress("Calculating totals...");
//     const othersTotal = validItems.reduce((sum, item) => sum + item.amount, 0);
//     const totalAmount = othersTotal;
//     const netAmount = othersTotal;
//     const totalWithoutDiscount = othersTotal / (1 - discountPercent / 100);
//     const cgst = includeGst ? (othersTotal * 0.09) : 0;
//     const sgst = includeGst ? (othersTotal * 0.09) : 0;
//     const totalAmountWithGst = othersTotal + cgst + sgst;
//     const roundOff = Math.round(totalAmountWithGst) - totalAmountWithGst;
//     const finalAmount = Math.round(totalAmountWithGst);

//     // Generate PDF using jsPDF
//     setPdfProgress("Generating PDF document...");
    
//     const { jsPDF } = (window as any).jspdf;
//     const doc = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
    
//     let yPos = 15;

//     // Logo (simple text box)
//     doc.setFillColor(245, 245, 245);
//     doc.rect(15, yPos, 20, 20, 'F');
//     doc.setFontSize(16);
//     doc.setFont('helvetica', 'bold');
//     doc.text('RT', 25, yPos + 13, { align: 'center' });

//     // Company Info
//     doc.setFontSize(14);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Raj TILES', 40, yPos + 5);
    
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'normal');
//     doc.text('JAL CHHAYA ROW HOUSE, SATELLITE ROAD,', 40, yPos + 10);
//     doc.text('PUNA, MOTA VARACHHA', 40, yPos + 14);
//     doc.text('Surat Gujarat - 394101', 40, yPos + 18);
//     doc.text('98255 32006', 40, yPos + 22);

//     // Right side info
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Original', pageWidth - 15, yPos + 5, { align: 'right' });
    
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`Quotation No: ${product._id?.toString().slice(-8).toUpperCase()}`, pageWidth - 15, yPos + 10, { align: 'right' });
//     doc.text(`Date: ${formatDate(product.date)}`, pageWidth - 15, yPos + 14, { align: 'right' });
//     const validityDate = new Date(product.date);
//     validityDate.setDate(validityDate.getDate() + 15);
//     doc.text(`Validity: ${formatDate(validityDate)}`, pageWidth - 15, yPos + 18, { align: 'right' });

//     yPos += 30;

//     // Quotation Title
//     doc.setFillColor(0, 0, 0);
//     doc.rect(15, yPos, pageWidth - 30, 8, 'F');
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.text('QUOTATION', pageWidth / 2, yPos + 5.5, { align: 'center' });
//     doc.setTextColor(0, 0, 0);

//     yPos += 12;

//     // Customer Info
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Buyer (Bill To):', 15, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(product.name || 'CUSTOMER', 15, yPos + 4);
//     doc.text(product.address || 'Surat, Gujarat', 15, yPos + 8);
//     doc.text(`State: Gujarat, Code: 24`, 15, yPos + 12);
//     doc.text(`M: ${product.number || '0000000000'}`, 15, yPos + 16);

//     doc.setFont('helvetica', 'bold');
//     doc.text('Consignee (Ship To):', pageWidth / 2 + 5, yPos);
//     doc.setFont('helvetica', 'normal');
//     doc.text(product.consigneeName || product.name || 'CUSTOMER', pageWidth / 2 + 5, yPos + 4);
//     doc.text(product.consigneeAddress || product.address || 'Surat, Gujarat', pageWidth / 2 + 5, yPos + 8);
//     doc.text(`State: Gujarat, Code: 24`, pageWidth / 2 + 5, yPos + 12);
//     doc.text(`M: ${product.consigneeMobile || product.number || '0000000000'}`, pageWidth / 2 + 5, yPos + 16);

//     yPos += 25;

//     // Items Table
//     const tableData = validItems.map(item => [
//       item.serialNo.toString(),
//       `${item.name}\n${item.description}`,
//       item.code || '-',
//       '', // Image column (will add images separately)
//       formatCurrency(item.rate),
//       formatCurrency(item.qty),
//       formatCurrency(discountPercent),
//       formatCurrency(item.amount)
//     ]);

//     doc.autoTable({
//       startY: yPos,
//       head: [['SR.NO', 'DESCRIPTION', 'SKU CODE', 'IMAGE', 'PRICE', 'QTY', 'DISC%', 'AMOUNT']],
//       body: tableData,
//       theme: 'grid',
//       headStyles: {
//         fillColor: [240, 240, 240],
//         textColor: [0, 0, 0],
//         fontStyle: 'bold',
//         fontSize: 8,
//         halign: 'center'
//       },
//       bodyStyles: {
//         fontSize: 8,
//         cellPadding: 3
//       },
//       columnStyles: {
//         0: { halign: 'center', cellWidth: 15 },
//         1: { halign: 'left', cellWidth: 50 },
//         2: { halign: 'center', cellWidth: 22 },
//         3: { halign: 'center', cellWidth: 25 },
//         4: { halign: 'right', cellWidth: 20 },
//         5: { halign: 'center', cellWidth: 15 },
//         6: { halign: 'right', cellWidth: 18 },
//         7: { halign: 'right', cellWidth: 25 }
//       },
//       didDrawCell: (data:any) => {
//         // Add images to the IMAGE column
//         if (data.column.index === 3 && data.section === 'body') {
//           const item = validItems[data.row.index];
//           if (item?.base64) {
//             try {
//               const imgWidth = 15;
//               const imgHeight = 15;
//               const xPos = data.cell.x + (data.cell.width - imgWidth) / 2;
//               const yPos = data.cell.y + (data.cell.height - imgHeight) / 2;
//               doc.addImage(item.base64, 'JPEG', xPos, yPos, imgWidth, imgHeight);
//             } catch (err) {
//               console.warn('Failed to add image:', err);
//             }
//           }
//         }
//       }
//     });

//     yPos = (doc as any).lastAutoTable.finalY + 5;

//     // Summary Section
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'bold');
//     doc.text('SUMMARY', 15, yPos);
//     yPos += 5;

//     const summaryData = [
//       ['SR. NO.', 'AREA', 'NET AMOUNT'],
//       ['26', 'Others', formatCurrency(othersTotal)],
//       ['Total Amount', '', formatCurrency(totalAmount)],
//       ['Net Amount', '', formatCurrency(netAmount)],
//       ['Total without Discount', '', formatCurrency(totalWithoutDiscount)]
//     ];

//     if (includeGst) {
//       summaryData.push(['CGST (9%)', '', formatCurrency(cgst)]);
//       summaryData.push(['SGST (9%)', '', formatCurrency(sgst)]);
//     }

//     summaryData.push(['Total Amount', '', formatCurrency(totalAmountWithGst)]);
//     summaryData.push(['Round Off', '', formatCurrency(roundOff)]);
//     summaryData.push(['Final Amount', '', formatCurrency(finalAmount)]);

//     doc.autoTable({
//       startY: yPos,
//       body: summaryData,
//       theme: 'grid',
//       styles: {
//         fontSize: 8,
//         cellPadding: 2
//       },
//       columnStyles: {
//         0: { halign: 'left', cellWidth: 60 },
//         1: { halign: 'center', cellWidth: 60 },
//         2: { halign: 'right', cellWidth: 60 }
//       },
//       didParseCell: (data:any) => {
//         if (data.row.index === summaryData.length - 1) {
//           data.cell.styles.fillColor = [0, 0, 0];
//           data.cell.styles.textColor = [255, 255, 255];
//           data.cell.styles.fontStyle = 'bold';
//         }
//       }
//     });

//     yPos = (doc as any).lastAutoTable.finalY + 3;

//     // Amount in words
//     doc.setFontSize(7);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`Amount in words: ${numberToWords(finalAmount)} Rupees Only`, 15, yPos);

//     yPos += 8;

//     // Terms & Conditions
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Terms & Conditions:', 15, yPos);
//     yPos += 4;
    
//     doc.setFontSize(7);
//     doc.setFont('helvetica', 'normal');
//     const terms = [
//       '• No return policy – Sold goods will not be taken back.',
//       '• Free delivery on truckload orders.',
//       '• Delivery orders must be placed at least 15 days in advance.',
//       '• Only Cash Rate.'
//     ];
    
//     terms.forEach(term => {
//       doc.text(term, 20, yPos);
//       yPos += 4;
//     });

//     // Brands section
//     yPos += 5;
//     doc.setFontSize(8);
//     const brands = ['Jaquar', 'kerakoll', 'Roff', 'Simola', 'SEGA', 'MYK LATICRETE', 'SONARA', 'Wintouch', 'AGILIS', 'LEMZON', 'LEZORA'];
//     const brandX = 15;
//     let brandY = yPos;
//     let brandCol = 0;
    
//     brands.forEach(brand => {
//       doc.text(brand, brandX + (brandCol * 45), brandY);
//       brandCol++;
//       if (brandCol >= 4) {
//         brandCol = 0;
//         brandY += 5;
//       }
//     });

//     // Footer
//     yPos = pageHeight - 25;
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'normal');
//     doc.text('For RAJ TILES', pageWidth - 15, yPos, { align: 'right' });
//     yPos += 15;
//     doc.line(pageWidth - 60, yPos, pageWidth - 15, yPos);
//     doc.text('Authorized Signatory', pageWidth - 15, yPos + 4, { align: 'right' });
//     doc.text('Prepared By: CHARMI VORA', 15, yPos + 4);

//     // Save PDF
//     setPdfProgress("Saving PDF...");
//     const sanitizedName = product.name.replace(/[^a-z0-9]/gi, '_');
//     const filename = `Quotation_${sanitizedName}_${new Date().toISOString().split('T')[0]}.pdf`;
    
//     doc.save(filename);
//     console.log('✅ PDF generated successfully');

//     // Success notification
//     setShowPdfModal(false);
//     setTimeout(() => {
//       showToast(`PDF downloaded: ${filename}`, "success");
//     }, 300);

//   } catch (error: any) {
//     console.error('❌ PDF generation error:', error);
//     setShowPdfModal(false);
//     setTimeout(() => {
//       showToast(`Failed to generate PDF: ${error.message}`, "error");
//     }, 300);
//   } finally {
//     setDownloadingPdfId(null);
//   }
// };


// ============================================
// PDF Generator - Professional Quality
// Using jsPDF + autoTable (TEXT-BASED, NOT IMAGE)
// ============================================

const toBase64 = async (imageUrl: string): Promise<string> => {
  try {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('data:')) return imageUrl;
    
    const response = await fetch(imageUrl, { mode: 'cors' });
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Image conversion failed:', error);
    return '';
  }
};

const numberToWords = (num: number): string => {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

  if (num === 0) return "Zero";

  const convert = (n: number): string => {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
  };

  if (num < 1000) return convert(num);
  if (num < 100000) return `${convert(Math.floor(num / 1000))} Thousand ${convert(num % 1000)}`.trim();
  if (num < 10000000) return `${convert(Math.floor(num / 100000))} Lakh ${convert(num % 100000)}`.trim();
  return `${convert(Math.floor(num / 10000000))} Crore ${convert(num % 10000000)}`.trim();
};

const formatCurrency = (value: number): string => value.toFixed(2);

const formatDate = (date: any): string => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Load jsPDF and autoTable
const loadJsPDFLibraries = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof (window as any).jspdf !== 'undefined') {
      resolve();
      return;
    }

    const jspdfScript = document.createElement('script');
    jspdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    jspdfScript.onload = () => {
      console.log('✅ jsPDF loaded');
      
      const autoTableScript = document.createElement('script');
      autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
      autoTableScript.onload = () => {
        console.log('✅ jsPDF autoTable loaded');
        resolve();
      };
      autoTableScript.onerror = () => reject(new Error('Failed to load autoTable'));
      document.head.appendChild(autoTableScript);
    };
    jspdfScript.onerror = () => reject(new Error('Failed to load jsPDF'));
    document.head.appendChild(jspdfScript);
  });
};

// ============================================
// Main PDF Generation Function
// ============================================

export const handleDownloadPDF = async (
  product: any,
  setDownloadingPdfId: (id: string | null) => void,
  setPdfCustomerName: (name: string) => void,
  setShowPdfModal: (show: boolean) => void,
  setPdfProgress: (progress: string) => void,
  showToast: (message: string, type: string) => void
) => {
  try {
    if (!product.items || product.items.length === 0) {
      showToast("Cannot generate PDF: No items in quotation", "error");
      return;
    }

    setDownloadingPdfId(product._id);
    setPdfCustomerName(product.name);
    setShowPdfModal(true);
    setPdfProgress("Loading PDF library...");

    console.log('📥 Starting PDF generation for:', product.name);

    await loadJsPDFLibraries();

    // Calculate values
    const discountPercent = parseFloat(product.dis) || 0;
    const isNRP = product.value === 'nrp';
    const isMRP = product.value === 'mrp';
    const isManual = product.value === 'manual';
    const includeGst = product.includeGst === true;

    setPdfProgress("Processing items and images...");
    console.log(`📦 Processing ${product.items?.length || 0} items...`);

    const itemsWithImages = await Promise.all(
      (product.items || []).map(async (itemEntry: any, index: number) => {
        const item = itemEntry.item || itemEntry;
        if (!item) return null;

        let rate = 0;
        if (isManual) {
          rate = itemEntry.manualPrice || 0;
        } else if (isNRP) {
          rate = parseFloat(item.nrp) || 0;
        } else if (isMRP) {
          rate = parseFloat(item.mrp) || 0;
        }

        const qty = parseFloat(itemEntry.quantity) || 1;
        const amount = rate * qty;
        const base64 = item.image ? await toBase64(item.image) : '';

        return {
          serialNo: index + 1,
          name: item.name || 'N/A',
          description: item.description || '',
          code: item._id?.toString().slice(-8).toUpperCase() || '',
          rate,
          qty,
          amount,
          base64
        };
      })
    );

    const validItems = itemsWithImages.filter(item => item !== null);
    console.log(`✅ Processed ${validItems.length} valid items`);

    // Calculate totals
    setPdfProgress("Calculating totals...");
    const othersTotal = validItems.reduce((sum, item) => sum + item.amount, 0);
    const totalAmount = othersTotal;
    const netAmount = othersTotal;
    const totalWithoutDiscount = othersTotal / (1 - discountPercent / 100);
    const cgst = includeGst ? (othersTotal * 0.09) : 0;
    const sgst = includeGst ? (othersTotal * 0.09) : 0;
    const totalAmountWithGst = othersTotal + cgst + sgst;
    const roundOff = Math.round(totalAmountWithGst) - totalAmountWithGst;
    const finalAmount = Math.round(totalAmountWithGst);

    // Generate PDF
    setPdfProgress("Generating PDF document...");
    
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    let yPos = 15;
    const leftMargin = 15;
    const rightMargin = pageWidth - 15;
    const contentWidth = rightMargin - leftMargin;

    // ===== HEADER BOX =====
    doc.setLineWidth(0.5);
    doc.rect(leftMargin, yPos, contentWidth, 45);

    // Logo box
    doc.rect(leftMargin + 3, yPos + 3, 25, 25);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('QG', leftMargin + 15.5, yPos + 17, { align: 'center' });

    // Company info
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('QUOTATION GENERATOR', leftMargin + 32, yPos + 8);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('JAL CHHAYA ROW HOUSE, SATELLITE ROAD,', leftMargin + 32, yPos + 13);
    doc.text('PUNA, MOTA VARACHHA', leftMargin + 32, yPos + 17);
    doc.text('Surat Gujarat - 394101', leftMargin + 32, yPos + 21);
    doc.text('98255 32006', leftMargin + 32, yPos + 25);

    // Right side - Original & Details
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Original', rightMargin - 3, yPos + 5, { align: 'right' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const quotationNo = product._id?.toString().slice(-8).toUpperCase() || 'N/A';
    doc.text(`Quotation No: ${quotationNo}`, rightMargin - 3, yPos + 10, { align: 'right' });
    doc.text(`Date: ${formatDate(product.date)}`, rightMargin - 3, yPos + 14, { align: 'right' });
    const validityDate = new Date(product.date);
    validityDate.setDate(validityDate.getDate() + 15);
    doc.text(`Validity: ${formatDate(validityDate)}`, rightMargin - 3, yPos + 18, { align: 'right' });

    yPos += 48;

    // ===== QUOTATION TITLE =====
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos, rightMargin, yPos);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('QUOTATION', pageWidth / 2, yPos + 6, { align: 'center' });
    yPos += 9;
    doc.line(leftMargin, yPos, rightMargin, yPos);

    yPos += 8;

    // ===== BUYER & CONSIGNEE BOX =====
    const buyerBoxHeight = 25;
    doc.rect(leftMargin, yPos, contentWidth, buyerBoxHeight);
    
    const midPoint = leftMargin + (contentWidth / 2);
    doc.line(midPoint, yPos, midPoint, yPos + buyerBoxHeight);

    // Buyer (Left)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Buyer (Bill To):', leftMargin + 3, yPos + 5);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(product.name || 'CUSTOMER', leftMargin + 3, yPos + 10);
    doc.text(product.address || 'Surat, Gujarat', leftMargin + 3, yPos + 14);
    doc.text('State: Gujarat, Code: 24', leftMargin + 3, yPos + 18);
    doc.text(`M: ${product.number || '0000000000'}`, leftMargin + 3, yPos + 22);

    // Consignee (Right)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Consignee (Ship To):', midPoint + 3, yPos + 5);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(product.consigneeName || product.name || 'CUSTOMER', midPoint + 3, yPos + 10);
    doc.text(product.consigneeAddress || product.address || 'Surat, Gujarat', midPoint + 3, yPos + 14);
    doc.text('State: Gujarat, Code: 24', midPoint + 3, yPos + 18);
    doc.text(`M: ${product.consigneeMobile || product.number || '0000000000'}`, midPoint + 3, yPos + 22);

    yPos += buyerBoxHeight + 5;

    // ===== ITEMS TABLE =====
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Items', leftMargin, yPos);
    yPos += 2;

    const tableData = validItems.map(item => [
      item.serialNo.toString(),
      `${item.name}\n${item.description}`,
      item.code || '-',
      '', // Image placeholder
      formatCurrency(item.rate),
      formatCurrency(item.qty),
      formatCurrency(discountPercent),
      formatCurrency(item.amount)
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['SR.NO', 'DESCRIPTION', 'SKU CODE', 'IMAGE', 'PRICE', 'QTY', 'DISC%', 'AMOUNT']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.3
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        1: { halign: 'left', cellWidth: 60 },
        2: { halign: 'center', cellWidth: 22 },
        3: { halign: 'center', cellWidth: 20 },
        4: { halign: 'right', cellWidth: 20 },
        5: { halign: 'center', cellWidth: 15 },
        6: { halign: 'right', cellWidth: 15 },
        7: { halign: 'right', cellWidth: 23 }
      },
      didDrawCell: (data:any) => {
        // Add images
        if (data.column.index === 3 && data.section === 'body') {
          const item = validItems[data.row.index];
          if (item?.base64) {
            try {
              const imgSize = 15;
              const xPos = data.cell.x + (data.cell.width - imgSize) / 2;
              const yPos = data.cell.y + (data.cell.height - imgSize) / 2;
              doc.addImage(item.base64, 'JPEG', xPos, yPos, imgSize, imgSize);
            } catch (err) {
              console.warn('Failed to add image:', err);
            }
          }
        }
      }
    });

    yPos = (doc as any).lastAutoTable.finalY + 3;

    // ===== TOTAL ROW =====
    doc.setLineWidth(0.3);
    doc.rect(leftMargin, yPos, contentWidth, 7);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Total', leftMargin + 3, yPos + 5);
    doc.text('Others + Total Amount', rightMargin - 35, yPos + 5, { align: 'right' });
    doc.text(formatCurrency(othersTotal), rightMargin - 3, yPos + 5, { align: 'right' });

    yPos += 10;

    // ===== SUMMARY TABLE =====
    const summaryData = [
      ['SR. NO.', 'AREA', 'NET AMOUNT'],
      ['26', 'Others', formatCurrency(othersTotal)],
      ['Total Amount', '', formatCurrency(totalAmount)],
      ['Net Amount', '', formatCurrency(netAmount)],
      ['', 'Total without Discount:', formatCurrency(totalWithoutDiscount)]
    ];

    if (includeGst) {
      summaryData.push(['', 'CGST (9%):', formatCurrency(cgst)]);
      summaryData.push(['', 'SGST (9%):', formatCurrency(sgst)]);
    }

    summaryData.push(['', 'Total Amount:', formatCurrency(totalAmountWithGst)]);
    summaryData.push(['', 'Round Off:', formatCurrency(roundOff)]);
    summaryData.push(['Final Amount:', '', formatCurrency(finalAmount)]);

    doc.autoTable({
      startY: yPos,
      body: summaryData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [0, 0, 0],
        lineWidth: 0.3
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 50, fontStyle: 'bold' },
        1: { halign: 'center', cellWidth: 70 },
        2: { halign: 'right', cellWidth: 60 }
      },
      didParseCell: (data:any) => {
        // Header row (first row)
        if (data.row.index === 0) {
          data.cell.styles.fillColor = [240, 240, 240];
          data.cell.styles.fontStyle = 'bold';
        }
        // Final Amount row (last row)
        if (data.row.index === summaryData.length - 1) {
          data.cell.styles.fillColor = [0, 0, 0];
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = 9;
        }
      }
    });

    yPos = (doc as any).lastAutoTable.finalY + 3;

    // Amount in words
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`Amount in words: ${numberToWords(finalAmount)} Rupees Only`, leftMargin, yPos);
    yPos += 4;
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('Please find below items are also available please contact for further details.', leftMargin, yPos);
    doc.setTextColor(0, 0, 0);

    yPos += 8;

    // ===== TERMS & CONDITIONS =====
    doc.setLineWidth(0.3);
    const termsHeight = 25;
    doc.rect(leftMargin, yPos, contentWidth, termsHeight);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Terms & Conditions:', leftMargin + 3, yPos + 5);
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    const terms = [
      'No return policy – Sold goods will not be taken back.',
      'Free delivery on truckload orders.',
      'Delivery orders must be placed at least 15 days in advance.',
      'Only Cash Rate.'
    ];
    
    let termsY = yPos + 10;
    terms.forEach(term => {
      doc.text(`• ${term}`, leftMargin + 5, termsY);
      termsY += 4;
    });

    yPos += termsHeight + 3;

    // ===== BRANDS SECTION =====
    const brandsHeight = 30;
    doc.rect(leftMargin, yPos, contentWidth, brandsHeight);
    
    doc.setFontSize(8);
    const brands = [
      'Jaquar', 'kerakoll', 'Roff\nPREVENT • PROTECT', 'simola\nVITRIFIED TILES',
      'SEGA\nTILES', 'MYK LATICRETE', 'SONARA\nSANITARY WARES', 'Wintouch',
      'AGILIS', 'LEMZON\nempire of tiles', 'LEZORA\nempire of tiles'
    ];
    
    const brandColWidth = contentWidth / 4;
    const brandRowHeight = brandsHeight / 3;
    let brandIndex = 0;
    
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (brandIndex < brands.length) {
          const x = leftMargin + (col * brandColWidth) + (brandColWidth / 2);
          const y = yPos + (row * brandRowHeight) + (brandRowHeight / 2);
          const lines = brands[brandIndex].split('\n');
          
          doc.setFont('helvetica', 'bold');
          if (lines.length > 1) {
            doc.text(lines[0], x, y - 1, { align: 'center' });
            doc.setFontSize(6);
            doc.setFont('helvetica', 'normal');
            doc.text(lines[1], x, y + 2, { align: 'center' });
            doc.setFontSize(8);
          } else {
            doc.text(lines[0], x, y, { align: 'center' });
          }
          
          brandIndex++;
        }
      }
    }

    yPos += brandsHeight + 3;

    // ===== FOOTER =====
    const footerHeight = 30;
    doc.rect(leftMargin, yPos, contentWidth, footerHeight);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('For RAJ TILES', rightMargin - 3, yPos + 8, { align: 'right' });
    
    doc.line(rightMargin - 50, yPos + 20, rightMargin - 3, yPos + 20);
    doc.setFont('helvetica', 'bold');
    doc.text('Authorized Signatory', rightMargin - 3, yPos + 24, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.text('Prepared By: CHARMI VORA', leftMargin + 3, yPos + 24);

    // Save PDF
    setPdfProgress("Saving PDF...");
    const sanitizedName = product.name.replace(/[^a-z0-9]/gi, '_');
    const filename = `Quotation_${sanitizedName}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    doc.save(filename);
    console.log('✅ PDF generated successfully');

    setShowPdfModal(false);
    setTimeout(() => {
      showToast(`PDF downloaded: ${filename}`, "success");
    }, 300);

  } catch (error: any) {
    console.error('❌ PDF generation error:', error);
    setShowPdfModal(false);
    setTimeout(() => {
      showToast(`Failed to generate PDF: ${error.message}`, "error");
    }, 300);
  } finally {
    setDownloadingPdfId(null);
  }
};