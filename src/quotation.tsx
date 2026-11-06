// import React, { useState, useEffect } from "react";
// import {
//   PlusCircle,
//   AlertCircle,
//   Trash2,
//   Search,
//   ArrowRight,
//   ArrowLeft,
//   CheckCircle,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// // =============================================
// // TYPES
// // =============================================
// interface Item {
//   _id: string;
//   name: string;
//   description: string;
//   nrp: number;
//   mrp: number;
//   image?: string | null;
// }

// interface SelectedItem extends Item {
//   quantity: number;
//   selectedPrice: number;
// }

// interface FormData {
//   name: string;
//   number: string;
//   address: string;
//   includeGst: boolean;
//   dis: string;
//   priceType: string;
//   date: string;
// }

// // =============================================
// // API ROUTES
// // =============================================

// let userString = localStorage.getItem("user");
// let user = typeof userString === 'string' ? JSON.parse(userString) : null;
// const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api`;
// const API_ROUTES = {
//   CREATE_QUOTATION: `${API_BASE_URL}/products/add`,
//   GET_ALL_ITEMS: `${API_BASE_URL}/items?userId=${user?.id}`,
// };

// function QuotationPage() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1); // 1: Form, 2: Items
//   const [formData, setFormData] = useState<FormData>({
//     name: "",
//     number: "",
//     address: "",
//     includeGst: false,
//     dis: "",
//     priceType: "",
//     date: new Date().toISOString().split("T")[0],
//   });
  
//   const [availableItems, setAvailableItems] = useState<Item[]>([]);
//   const [filteredItems, setFilteredItems] = useState<Item[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingItems, setLoadingItems] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [quotationId, setQuotationId] = useState<string | null>(null);

//   // Fetch available items on component mount
//   useEffect(() => {
//     fetchAvailableItems();
//   }, []);

//   // Filter items based on search query
//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setFilteredItems([]);
//     } else {
//       const filtered = availableItems.filter(item =>
//         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.description.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredItems(filtered);
//     }
//   }, [searchQuery, availableItems]);

//   const fetchAvailableItems = async () => {
//     setLoadingItems(true);
//     try {
//       const response = await fetch(API_ROUTES.GET_ALL_ITEMS);
//       const data = await response.json();
      
//       if (data.success && data.items) {
//         setAvailableItems(data.items);
//       } else {
//         throw new Error("Failed to fetch items");
//       }
//     } catch (err) {
//       console.error("Error fetching items:", err);
//       // Fallback dummy data
//       setAvailableItems([
//         { _id: "1", name: "Tile A1", description: "Premium tiles", nrp: 100, mrp: 120 },
//         { _id: "2", name: "Tile B2", description: "Standard tiles", nrp: 80, mrp: 95 },
//         { _id: "3", name: "Marble XL", description: "Luxury marble", nrp: 200, mrp: 250 },
//       ]);
//     } finally {
//       setLoadingItems(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { id, value, type } = e.target;
    
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       setFormData({
//         ...formData,
//         [id]: checked,
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [id]: value,
//       });
//     }
//   };

//   const validateStep1 = () => {
//     if (!formData.name.trim()) {
//       alert("Please enter customer name");
//       return false;
//     }
//     if (!formData.priceType) {
//       alert("Please select price type (NRP or MRP)");
//       return false;
//     }
//     if (!formData.date) {
//       alert("Please select date");
//       return false;
//     }
//     return true;
//   };

//   const handleNext = () => {
//     if (validateStep1()) {
//       setStep(2);
//     }
//   };

//   const handleAddItem = (item: Item) => {
//     if (selectedItems.find((si) => si._id === item._id)) {
//       alert("This item is already added.");
//       return;
//     }

//     const selectedPrice = formData.priceType === "nrp" ? item.nrp : item.mrp;

//     const newSelectedItem: SelectedItem = {
//       ...item,
//       quantity: 1,
//       selectedPrice,
//     };

//     setSelectedItems([...selectedItems, newSelectedItem]);
//     setSearchQuery(""); // Clear search after adding
//   };

//   const handleQuantityChange = (itemId: string, quantity: number) => {
//     if (quantity < 1) return;

//     setSelectedItems(
//       selectedItems.map((item) =>
//         item._id === itemId ? { ...item, quantity } : item
//       )
//     );
//   };

//   const handleRemoveItem = (itemId: string) => {
//     setSelectedItems(selectedItems.filter((item) => item._id !== itemId));
//   };

//   const calculateTotals = () => {
//     const subtotal = selectedItems.reduce(
//       (sum, item) => sum + item.selectedPrice * item.quantity,
//       0
//     );
//     const discount = parseFloat(formData.dis) || 0;
//     const discountAmount = (subtotal * discount) / 100;
//     const total = subtotal - discountAmount;
//     const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

//     return { subtotal, discountAmount, total, totalQuantity };
//   };

//   const handleCreateQuotation = async () => {
//     if (selectedItems.length === 0) {
//       alert("Please add at least one item to continue");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const { totalQuantity, total } = calculateTotals();

//       const quotationData = {
//         name: formData.name.trim(),
//         number: formData.number.trim(),
//         address: formData.address.trim(),
//         includeGst: formData.includeGst, // true or false
//         dis: formData.dis || "0",
//         value: formData.priceType,
//         quantity: totalQuantity,
//         date: formData.date,
//         items: selectedItems.map((item) => item._id),
//         totalQuantity: totalQuantity,
//         totalAmount: total,
//         userId: user?.id || '',
//       };

//       const response = await fetch(API_ROUTES.CREATE_QUOTATION, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(quotationData),
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         setQuotationId(data.product._id);
//         navigate(`/dashboard`);
//       } else {
//         throw new Error(data.message || "Failed to create quotation");
//       }
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Unknown error";
//       setError(errorMessage);
//       alert(`Failed to create quotation: ${errorMessage}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setStep(1);
//     setFormData({
//       name: "",
//       number: "",
//       address: "",
//       includeGst: false,
//       dis: "",
//       priceType: "",
//       date: new Date().toISOString().split("T")[0],
//     });
//     setSelectedItems([]);
//     setQuotationId(null);
//     setError(null);
//     setSearchQuery("");
//   };

//   const { subtotal, discountAmount, total, totalQuantity } = calculateTotals();

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Progress Steps */}
//       <div className="mb-8">
//         <div className="flex items-center justify-center gap-4">
//           <div className={`flex items-center gap-2 ${step >= 1 ? 'text-red-700' : 'text-gray-400'}`}>
//             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-red-700 text-white' : 'bg-gray-200'}`}>
//               {step > 1 ? <CheckCircle size={20} /> : "1"}
//             </div>
//             <span className="font-semibold">Customer Details</span>
//           </div>
//           <div className="w-16 h-1 bg-gray-300"></div>
//           <div className={`flex items-center gap-2 ${step >= 2 ? 'text-red-700' : 'text-gray-400'}`}>
//             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-red-700 text-white' : 'bg-gray-200'}`}>
//               2
//             </div>
//             <span className="font-semibold">Add Products</span>
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
//           <AlertCircle size={20} />
//           <span>Error: {error}</span>
//         </div>
//       )}

//       {quotationId && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
//           <strong>✅ Quotation Created Successfully!</strong>
//           <p className="text-sm mt-1">Quotation ID: {quotationId}</p>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* LEFT SIDE - Form/Summary */}
//         <div className="space-y-6">
//           {step === 1 ? (
//             // Step 1: Customer Details Form
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//               <h2 className="text-2xl font-bold text-red-800 mb-6">
//                 Customer Details
//               </h2>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block font-semibold text-gray-700 mb-2">
//                     Customer Name <span className="text-red-600">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="Enter customer name"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-700 mb-2">
//                     Mobile Number <span className="text-red-600">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     id="number"
//                     value={formData.number}
//                     onChange={handleChange}
//                     placeholder="Enter mobile number"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-700 mb-2">
//                     Address <span className="text-red-600">*</span>
//                   </label>
//                   <textarea
//                     id="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     placeholder="Enter complete customer address"
//                     rows={3}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
//                   />
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <input
//                     type="checkbox"
//                     id="includeGst"
//                     checked={formData.includeGst}
//                     onChange={handleChange}
//                     className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
//                   />
//                   <label htmlFor="includeGst" className="font-semibold text-gray-700">
//                     Include GST in Quotation
//                   </label>
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-700 mb-2">
//                     Discount %
//                   </label>
//                   <input
//                     type="number"
//                     id="dis"
//                     value={formData.dis}
//                     onChange={handleChange}
//                     placeholder="Enter discount percentage"
//                     min="0"
//                     max="100"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-700 mb-2">
//                     Date <span className="text-red-600">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     id="date"
//                     value={formData.date}
//                     onChange={handleChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-700 mb-2">
//                     Price List Type <span className="text-red-600">*</span>
//                   </label>
//                   <select
//                     id="priceType"
//                     value={formData.priceType}
//                     onChange={handleChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
//                   >
//                     <option value="">Select Price Type</option>
//                     <option value="nrp">NRP (Net Rate Price)</option>
//                     <option value="mrp">MRP (Maximum Retail Price)</option>
//                   </select>
//                 </div>

//                 <button
//                   onClick={handleNext}
//                   className="w-full mt-6 px-6 py-3 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition shadow-sm flex items-center justify-center gap-2"
//                 >
//                   Next: Add Products
//                   <ArrowRight size={20} />
//                 </button>
//               </div>
//             </div>
//           ) : (
//             // Step 2: Summary
//             <div className="space-y-6">
//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <h3 className="text-xl font-bold text-red-800 mb-4">Customer Info</h3>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Name:</span>
//                     <span className="font-semibold">{formData.name}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Mobile:</span>
//                     <span className="font-semibold">{formData.number}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Address:</span>
//                     <span className="font-semibold text-right max-w-xs">{formData.address}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Include GST:</span>
//                     <span className={`font-semibold ${formData.includeGst ? 'text-green-600' : 'text-gray-500'}`}>
//                       {formData.includeGst ? 'Yes' : 'No'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Price Type:</span>
//                     <span className="font-semibold uppercase">{formData.priceType}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Date:</span>
//                     <span className="font-semibold">{formData.date}</span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setStep(1)}
//                   className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm flex items-center justify-center gap-2"
//                 >
//                   <ArrowLeft size={16} />
//                   Edit Details
//                 </button>
//               </div>

//               {selectedItems.length > 0 && (
//                 <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-sm border border-red-200">
//                   <h3 className="text-lg font-bold text-red-800 mb-4">
//                     Quotation Summary
//                   </h3>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-700">Total Items:</span>
//                       <span className="font-semibold">{selectedItems.length}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-700">Total Quantity:</span>
//                       <span className="font-semibold">{totalQuantity}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-700">Subtotal:</span>
//                       <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
//                     </div>
//                     {parseFloat(formData.dis) > 0 && (
//                       <div className="flex justify-between text-green-600">
//                         <span>Discount ({formData.dis}%):</span>
//                         <span className="font-semibold">-₹{discountAmount.toFixed(2)}</span>
//                       </div>
//                     )}
//                     <div className="flex justify-between text-lg font-bold text-red-800 pt-2 border-t border-red-300">
//                       <span>Total Amount:</span>
//                       <span>₹{total.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <button
//                 onClick={handleCreateQuotation}
//                 disabled={loading || selectedItems.length === 0}
//                 className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle size={20} />
//                     Continue & Create
//                   </>
//                 )}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* RIGHT SIDE - Product Search & Selection */}
//         <div className="space-y-6">
//           {step === 2 && (
//             <>
//               {/* Search Bar */}
//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <label className="block font-semibold text-gray-700 mb-3">
//                   Search Products
//                 </label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Type product name to search..."
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
//                   />
//                 </div>

//                 {/* Search Results */}
//                 {loadingItems ? (
//                   <div className="text-center py-8 text-gray-500">Loading...</div>
//                 ) : searchQuery.trim() !== "" && (
//                   <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
//                     {filteredItems.length === 0 ? (
//                       <p className="text-center text-gray-500 py-4">No products found</p>
//                     ) : (
//                       filteredItems.map((item) => (
//                         <div
//                           key={item._id}
//                           className="p-4 border border-gray-200 rounded-lg hover:border-red-300 transition"
//                         >
//                           <div className="flex justify-between items-start">
//                             <div className="flex-1">
//                               {/* //@ts-ignore */}
//                               <img className="w-16 h-16 object-cover" src={`${item.image}`} alt="" />
//                               <h4 className="font-semibold text-gray-800">{item.name}</h4>
//                               <p className="text-sm text-gray-600">{item.description}</p>

//                             </div>
//                             <button
//                               onClick={() => handleAddItem(item)}
//                               disabled={selectedItems.some((si) => si._id === item._id)}
//                               className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
//                             >
//                               {selectedItems.some((si) => si._id === item._id) ? "Added" : "Add"}
//                             </button>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Selected Items */}
//               {selectedItems.length > 0 && (
//                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                   <h3 className="text-xl font-bold text-red-800 mb-4">
//                     Selected Products ({selectedItems.length})
//                   </h3>

//                   <div className="space-y-3 max-h-96 overflow-y-auto">
//                     {selectedItems.map((item) => (
//                       <div
//                         key={item._id}
//                         className="p-4 border border-red-200 rounded-lg bg-red-50"
//                       >
//                         <div className="flex justify-between items-start mb-3">
//                           <div>
//                             <h4 className="font-semibold text-gray-800">{item.name}</h4>
//                             <p className="text-sm text-gray-600">{item.description}</p>
//                             <p className="text-sm text-gray-700 mt-1">
//                               Price: <strong>₹{item.selectedPrice}</strong>
//                             </p>
//                           </div>
//                           <button
//                             onClick={() => handleRemoveItem(item._id)}
//                             className="text-red-600 hover:text-red-800 transition"
//                           >
//                             <Trash2 size={20} />
//                           </button>
//                         </div>

//                         <div className="flex items-center gap-3">
//                           <label className="text-sm font-medium text-gray-700">
//                             Qty:
//                           </label>
//                           <input
//                             type="number"
//                             min="1"
//                             value={item.quantity}
//                             onChange={(e) =>
//                               handleQuantityChange(item._id, parseInt(e.target.value) || 1)
//                             }
//                             className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
//                           />
//                           <span className="text-sm font-semibold text-gray-800">
//                             = ₹{(item.selectedPrice * item.quantity).toFixed(2)}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </>
//           )}

//           {step === 1 && (
//             <div className="bg-gray-50 p-8 rounded-xl border-2 border-dashed border-gray-300 text-center">
//               <p className="text-gray-500 text-lg">
//                 Complete customer details to search and add products
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {quotationId && (
//         <div className="mt-6 text-center">
//           <button
//             onClick={handleReset}
//             className="px-8 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"
//           >
//             Create New Quotation
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default QuotationPage;

// // import { useState, useEffect } from "react";
// // import {
// //   Trash2,
// //   Search,
// //   CheckCircle,
// //   User,
// //   Package,
// //   ShoppingCart,
// //   X,
// //   Plus,
// //   Minus,
// // } from "lucide-react";

// //  function QuotationPage() {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     number: "",
// //     address: "",
// //     includeGst: false,
// //     dis: "",
// //     priceType: "",
// //     date: new Date().toISOString().split("T")[0],
// //   });
  
// //   const [availableItems, setAvailableItems] = useState([]);
// //   const [filteredItems, setFilteredItems] = useState([]);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [selectedItems, setSelectedItems] = useState<any>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [loadingItems, setLoadingItems] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [success, setSuccess] = useState(false);

// //   const getApiRoutes = () => {
// //     let userString = null;
// //     let user = null;
    
// //     try {
// //       userString = localStorage.getItem("user");
// //       user = userString ? JSON.parse(userString) : null;
// //     } catch (e) {
// //       console.error("Error parsing user:", e);
// //     }
    
// //     const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
// //     const apiBase = baseUrl + "/api";
    
// //     return {
// //       CREATE_QUOTATION: apiBase + "/products/add",
// //       GET_ALL_ITEMS: apiBase + "/items?userId=" + (user?.id || ''),
// //     };
// //   };

// //   useEffect(() => {
// //     fetchAvailableItems();
// //   }, []);

// //   useEffect(() => {
// //     if (searchQuery.trim() === "") {
// //       setFilteredItems([]);
// //     } else {
// //       const filtered = availableItems.filter((item:any) =>
// //         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         item.description.toLowerCase().includes(searchQuery.toLowerCase())
// //       );
// //       setFilteredItems(filtered);
// //     }
// //   }, [searchQuery, availableItems]);

// //   const fetchAvailableItems = async () => {
// //     setLoadingItems(true);
// //     try {
// //       const routes = getApiRoutes();
// //       const response = await fetch(routes.GET_ALL_ITEMS);
// //       const data = await response.json();
      
// //       if (data.success && data.items) {
// //         setAvailableItems(data.items);
// //       } else {
// //         throw new Error("Failed to fetch items");
// //       }
// //     } catch (err) {
// //       console.error("Error fetching items:", err);
// //       setAvailableItems([]);
// //     } finally {
// //       setLoadingItems(false);
// //     }
// //   };

// //   const handleChange = (e:any) => {
// //     const target = e.target;
// //     const id = target.id;
// //     const value = target.value;
// //     const type = target.type;
    
// //     if (type === 'checkbox') {
// //       const checked = target.checked;
// //       setFormData({
// //         ...formData,
// //         [id]: checked,
// //       });
// //     } else {
// //       setFormData({
// //         ...formData,
// //         [id]: value,
// //       });
// //     }
// //   };

// //   const handleAddItem = (item:any) => {
// //     const exists = selectedItems.find((si:any) => si._id === item._id);
// //     if (exists) {
// //       alert("Item already added");
// //       return;
// //     }

// //     let selectedPrice;
// //     if (formData.priceType === "nrp") {
// //       selectedPrice = item.nrp;
// //     } else if (formData.priceType === "mrp") {
// //       selectedPrice = item.mrp;
// //     } else {
// //       selectedPrice = 0;
// //     }

// //     const newSelectedItem = {
// //       ...item,
// //       quantity: 1,
// //       selectedPrice,
// //     };

// //     setSelectedItems([...selectedItems, newSelectedItem]);
// //     setSearchQuery("");
// //   };

// //   const handleQuantityChange = (itemId:any, quantity:any) => {
// //     if (quantity < 1) return;
// //     setSelectedItems(
// //       selectedItems.map((item:any) =>
// //         item._id === itemId ? { ...item, quantity } : item
// //       )
// //     );
// //   };

// //   const handlePriceChange = (itemId:any, price:any) => {
// //     if (price < 0) return;
// //     setSelectedItems(
// //       selectedItems.map((item:any) =>
// //         item._id === itemId ? { ...item, selectedPrice: price } : item
// //       )
// //     );
// //   };

// //   const handleRemoveItem = (itemId:any) => {
// //     setSelectedItems(selectedItems.filter((item:any) => item._id !== itemId));
// //   };

// //   const calculateTotals = () => {
// //     const subtotal = selectedItems.reduce(
// //       (sum:any, item:any) => sum + item.selectedPrice * item.quantity,
// //       0
// //     );
// //     const discount = parseFloat(formData.dis) || 0;
// //     const discountAmount = (subtotal * discount) / 100;
// //     const total = subtotal - discountAmount;
// //     const totalQuantity = selectedItems.reduce((sum:any, item:any) => sum + item.quantity, 0);

// //     return { subtotal, discountAmount, total, totalQuantity };
// //   };

// //   const handleCreateQuotation = async () => {
// //     if (!formData.name.trim()) {
// //       alert("Please enter customer name");
// //       return;
// //     }
// //     if (!formData.priceType) {
// //       alert("Please select price type");
// //       return;
// //     }
// //     if (selectedItems.length === 0) {
// //       alert("Please add at least one product");
// //       return;
// //     }

// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const totals = calculateTotals();
// //       const totalQuantity = totals.totalQuantity;
// //       const total = totals.total;
      
// //       let userString = null;
// //       let user = null;
      
// //       try {
// //         userString = localStorage.getItem("user");
// //         user = userString ? JSON.parse(userString) : null;
// //       } catch (e) {
// //         console.error("Error parsing user:", e);
// //       }

// //       const quotationData = {
// //         name: formData.name.trim(),
// //         number: formData.number.trim(),
// //         address: formData.address.trim(),
// //         includeGst: formData.includeGst,
// //         dis: formData.dis || "0",
// //         value: formData.priceType,
// //         quantity: totalQuantity,
// //         date: formData.date,
// //         items: selectedItems.map((item:any) => item._id),
// //         totalQuantity: totalQuantity,
// //         totalAmount: total,
// //         userId: user?.id || '',
// //       };

// //       const routes = getApiRoutes();
// //       const response = await fetch(routes.CREATE_QUOTATION, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(quotationData),
// //       });

// //       const data = await response.json();

// //       if (response.ok && data.success) {
// //         setSuccess(true);
// //         setTimeout(() => {
// //           setFormData({
// //             name: "",
// //             number: "",
// //             address: "",
// //             includeGst: false,
// //             dis: "",
// //             priceType: "",
// //             date: new Date().toISOString().split("T")[0],
// //           });
// //           setSelectedItems([]);
// //           setSuccess(false);
// //         }, 2000);
// //       } else {
// //         throw new Error(data.message || "Failed to create quotation");
// //       }
// //     } catch (err) {
// //       const errorMessage:any = err instanceof Error ? err.message : "Unknown error";
// //       setError(errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const { subtotal, discountAmount, total, totalQuantity } = calculateTotals();

// //   return (
// //     <div className="min-h-screen bg-white">
// //       <div className="max-w-7xl mx-auto p-2 sm:p-3">
// //         {/* Header */}
// //         <div className="mb-2 pb-2 border-b-2 border-black">
// //           <h1 className="text-base sm:text-lg font-bold text-black">Create Quotation</h1>
// //         </div>

// //         {/* Alerts */}
// //         {error && (
// //           <div className="mb-2 p-2 bg-red-50 border border-red-600 text-red-600 text-xs flex items-center justify-between">
// //             <span>{error}</span>
// //             <button onClick={() => setError(null)}><X size={14} /></button>
// //           </div>
// //         )}
        
// //         {success && (
// //           <div className="mb-2 p-2 bg-black text-white text-xs flex items-center gap-2">
// //             <CheckCircle size={14} />
// //             <span>Quotation created successfully!</span>
// //           </div>
// //         )}

// //         {/* Main Grid */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
// //           {/* Left - Customer Form */}
// //           <div className="lg:col-span-1 space-y-2">
// //             <div className="border-2 border-black p-2">
// //               <h2 className="text-xs font-bold mb-2 flex items-center gap-1">
// //                 <User size={12} />
// //                 Customer Details
// //               </h2>

// //               <div className="space-y-1.5">
// //                 <div>
// //                   <label className="block text-xs font-bold mb-0.5">Name *</label>
// //                   <input
// //                     type="text"
// //                     id="name"
// //                     value={formData.name}
// //                     onChange={handleChange}
// //                     placeholder="Customer name"
// //                     className="w-full p-1 text-xs border-2 border-gray-300 focus:border-black outline-none"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-xs font-bold mb-0.5">Mobile</label>
// //                   <input
// //                     type="tel"
// //                     id="number"
// //                     value={formData.number}
// //                     onChange={handleChange}
// //                     placeholder="Phone number"
// //                     className="w-full p-1 text-xs border-2 border-gray-300 focus:border-black outline-none"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-xs font-bold mb-0.5">Address</label>
// //                   <textarea
// //                     id="address"
// //                     value={formData.address}
// //                     onChange={handleChange}
// //                     placeholder="Complete address"
// //                     rows={2}
// //                     className="w-full p-1 text-xs border-2 border-gray-300 focus:border-black outline-none resize-none"
// //                   />
// //                 </div>

// //                 <div className="flex items-center gap-2 p-1 bg-gray-50">
// //                   <input
// //                     type="checkbox"
// //                     id="includeGst"
// //                     checked={formData.includeGst}
// //                     onChange={handleChange}
// //                     className="w-3 h-3"
// //                   />
// //                   <label htmlFor="includeGst" className="text-xs font-bold">Include GST</label>
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-1.5">
// //                   <div>
// //                     <label className="block text-xs font-bold mb-0.5">Discount %</label>
// //                     <input
// //                       type="number"
// //                       id="dis"
// //                       value={formData.dis}
// //                       onChange={handleChange}
// //                       placeholder="0"
// //                       min="0"
// //                       max="100"
// //                       className="w-full p-1 text-xs border-2 border-gray-300 focus:border-black outline-none"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="block text-xs font-bold mb-0.5">Date *</label>
// //                     <input
// //                       type="date"
// //                       id="date"
// //                       value={formData.date}
// //                       onChange={handleChange}
// //                       className="w-full p-1 text-xs border-2 border-gray-300 focus:border-black outline-none"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label className="block text-xs font-bold mb-0.5">Price Type *</label>
// //                   <select
// //                     id="priceType"
// //                     value={formData.priceType}
// //                     onChange={handleChange}
// //                     className="w-full p-1 text-xs border-2 border-gray-300 focus:border-black outline-none"
// //                   >
// //                     <option value="">Select Price Type</option>
// //                     <option value="nrp">NRP</option>
// //                     <option value="mrp">MRP</option>
// //                     <option value="manual">Manual Entry</option>
// //                   </select>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Summary */}
// //             {selectedItems.length > 0 && (
// //               <div className="border-2 border-black bg-black text-white p-2">
// //                 <h3 className="text-xs font-bold mb-1.5">Summary</h3>
// //                 <div className="space-y-1 text-xs">
// //                   <div className="flex justify-between">
// //                     <span>Items:</span>
// //                     <span className="font-bold">{selectedItems.length}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span>Qty:</span>
// //                     <span className="font-bold">{totalQuantity}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span>Subtotal:</span>
// //                     <span className="font-bold">₹{subtotal.toFixed(2)}</span>
// //                   </div>
// //                   {parseFloat(formData.dis) > 0 && (
// //                     <div className="flex justify-between text-red-400">
// //                       <span>Discount ({formData.dis}%):</span>
// //                       <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
// //                     </div>
// //                   )}
// //                   <div className="flex justify-between pt-1 border-t border-white">
// //                     <span className="font-bold">Total:</span>
// //                     <span className="font-bold">₹{total.toFixed(2)}</span>
// //                   </div>
// //                 </div>
                
// //                 <button
// //                   onClick={handleCreateQuotation}
// //                   disabled={loading || selectedItems.length === 0}
// //                   className="w-full mt-2 p-1.5 bg-white text-black font-bold text-xs hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
// //                 >
// //                   {loading ? (
// //                     <>
// //                       <div className="animate-spin rounded-full h-3 w-3 border-2 border-black border-t-transparent"></div>
// //                       Creating...
// //                     </>
// //                   ) : (
// //                     <>
// //                       <CheckCircle size={12} />
// //                       Create Quotation
// //                     </>
// //                   )}
// //                 </button>
// //               </div>
// //             )}
// //           </div>

// //           {/* Middle - Search */}
// //           <div className="lg:col-span-1 space-y-2">
// //             <div className="border-2 border-black p-2">
// //               <h2 className="text-xs font-bold mb-2 flex items-center gap-1">
// //                 <Search size={12} />
// //                 Search Products
// //               </h2>

// //               <div className="relative mb-2">
// //                 <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
// //                 <input
// //                   type="text"
// //                   value={searchQuery}
// //                   onChange={(e) => setSearchQuery(e.target.value)}
// //                   placeholder="Search products..."
// //                   className="w-full pl-7 pr-2 py-1 text-xs border-2 border-gray-300 focus:border-black outline-none"
// //                 />
// //               </div>

// //               {loadingItems ? (
// //                 <div className="text-center py-6 text-xs text-gray-500">Loading...</div>
// //               ) : searchQuery.trim() !== "" && (
// //                 <div className="space-y-1.5 max-h-96 overflow-y-auto">
// //                   {filteredItems.length === 0 ? (
// //                     <p className="text-center text-xs text-gray-500 py-4">No products found</p>
// //                   ) : (
// //                     filteredItems.map((item:any) => (
// //                       <div
// //                         key={item._id}
// //                         className="p-1.5 border border-gray-300 hover:border-black"
// //                       >
// //                         <div className="flex gap-1.5 items-start">
// //                           {item.image && (
// //                             <img 
// //                               className="w-10 h-10 object-cover border border-gray-300" 
// //                               src={item.image} 
// //                               alt={item.name}
// //                             />
// //                           )}
// //                           <div className="flex-1 min-w-0">
// //                             <h4 className="font-bold text-xs truncate">{item.name}</h4>
// //                             <p className="text-xs text-gray-600 line-clamp-1">{item.description}</p>
// //                             <div className="flex gap-1 mt-0.5">
// //                               <span className="text-xs bg-gray-100 px-1">NRP: ₹{item.nrp}</span>
// //                               <span className="text-xs bg-gray-100 px-1">MRP: ₹{item.mrp}</span>
// //                             </div>
// //                           </div>
// //                           <button
// //                             onClick={() => handleAddItem(item)}
// //                             disabled={selectedItems.some((si:any) => si._id === item._id)}
// //                             className="px-1.5 py-0.5 text-xs bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
// //                           >
// //                             {selectedItems.some((si:any) => si._id === item._id) ? "✓" : "Add"}
// //                           </button>
// //                         </div>
// //                       </div>
// //                     ))
// //                   )}
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Right - Selected Items */}
// //           <div className="lg:col-span-1">
// //             <div className="border-2 border-black p-2">
// //               <h2 className="text-xs font-bold mb-2 flex items-center gap-1">
// //                 <ShoppingCart size={12} />
// //                 Selected ({selectedItems.length})
// //               </h2>

// //               {selectedItems.length === 0 ? (
// //                 <div className="text-center py-6 text-xs text-gray-500">
// //                   <Package size={24} className="mx-auto mb-1 text-gray-300" />
// //                   No items selected
// //                 </div>
// //               ) : (
// //                 <div className="space-y-1.5 max-h-[calc(100vh-150px)] overflow-y-auto">
// //                   {selectedItems.map((item:any) => (
// //                     <div
// //                       key={item._id}
// //                       className="p-1.5 border border-gray-300 bg-gray-50"
// //                     >
// //                       <div className="flex justify-between items-start mb-1.5">
// //                         <div className="flex-1 min-w-0">
// //                           <h4 className="font-bold text-xs">{item.name}</h4>
// //                           <p className="text-xs text-gray-600 line-clamp-1">{item.description}</p>
// //                         </div>
// //                         <button
// //                           onClick={() => handleRemoveItem(item._id)}
// //                           className="text-red-600 hover:text-red-800 p-0.5"
// //                         >
// //                           <Trash2 size={12} />
// //                         </button>
// //                       </div>

// //                       <div className="grid grid-cols-2 gap-1.5">
// //                         {formData.priceType === 'manual' ? (
// //                           <div>
// //                             <label className="text-xs font-bold mb-0.5 block">Price</label>
// //                             <input
// //                               type="number"
// //                               min="0"
// //                               step="0.01"
// //                               value={item.selectedPrice}
// //                               onChange={(e) =>
// //                                 handlePriceChange(item._id, parseFloat(e.target.value) || 0)
// //                               }
// //                               className="w-full p-1 text-xs border border-gray-300 focus:border-black outline-none"
// //                             />
// //                           </div>
// //                         ) : (
// //                           <div>
// //                             <label className="text-xs font-bold mb-0.5 block">Price</label>
// //                             <div className="p-1 text-xs font-bold border border-gray-300 bg-white">
// //                               ₹{item.selectedPrice}
// //                             </div>
// //                           </div>
// //                         )}
// //                         <div>
// //                           <label className="text-xs font-bold mb-0.5 block">Qty</label>
// //                           <div className="flex items-center gap-0.5 bg-white rounded border border-gray-300">
// //                             <button
// //                               onClick={() => {
// //                                 const newQty = Math.max(1, item.quantity - 1);
// //                                 handleQuantityChange(item._id, newQty);
// //                               }}
// //                               className="w-5 h-5 flex items-center justify-center hover:bg-gray-100"
// //                             >
// //                               <Minus size={10} />
// //                             </button>
// //                             <input
// //                               type="number"
// //                               min="1"
// //                               value={item.quantity}
// //                               onChange={(e) =>
// //                                 handleQuantityChange(item._id, parseInt(e.target.value) || 1)
// //                               }
// //                               className="w-8 text-center text-xs border-0 outline-none"
// //                             />
// //                             <button
// //                               onClick={() => {
// //                                 const newQty = item.quantity + 1;
// //                                 handleQuantityChange(item._id, newQty);
// //                               }}
// //                               className="w-5 h-5 flex items-center justify-center hover:bg-gray-100"
// //                             >
// //                               <Plus size={10} />
// //                             </button>
// //                           </div>
// //                         </div>
// //                       </div>

// //                       <div className="mt-1.5 pt-1.5 border-t border-gray-300 text-right">
// //                         <span className="text-xs font-bold">
// //                           Total: ₹{(item.selectedPrice * item.quantity).toFixed(2)}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// // export default QuotationPage;


import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  AlertCircle,
  Trash2,
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Plus,
  Minus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// =============================================
// TYPES
// =============================================
interface Item {
  _id: string;
  name: string;
  description: string;
  nrp: number;
  mrp: number;
  image?: string | null;
}

interface SelectedItem extends Item {
  quantity: number;
  selectedPrice: number;
}

interface FormData {
  name: string;
  number: string;
  address: string;
  includeGst: boolean;
  dis: string;
  priceType: string;
  date: string;
}

// =============================================
// API ROUTES
// =============================================

let userString = localStorage.getItem("user");
let user = typeof userString === 'string' ? JSON.parse(userString) : null;
const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api`;
const API_ROUTES = {
  CREATE_QUOTATION: `${API_BASE_URL}/products/add`,
  GET_ALL_ITEMS: `${API_BASE_URL}/items?userId=${user?.id}`,
};

function QuotationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Form, 2: Items
  const [formData, setFormData] = useState<FormData>({
    name: "",
    number: "",
    address: "",
    includeGst: false,
    dis: "",
    priceType: "",
    date: new Date().toISOString().split("T")[0],
  });
  
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quotationId, setQuotationId] = useState<string | null>(null);

  // Fetch available items on component mount
  useEffect(() => {
    fetchAvailableItems();
  }, []);

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems([]);
    } else {
      const filtered = availableItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, availableItems]);

  const fetchAvailableItems = async () => {
    setLoadingItems(true);
    try {
      const response = await fetch(API_ROUTES.GET_ALL_ITEMS);
      const data = await response.json();
      
      if (data.success && data.items) {
        setAvailableItems(data.items);
      } else {
        throw new Error("Failed to fetch items");
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setAvailableItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [id]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      alert("Please enter customer name");
      return false;
    }
    if (!formData.priceType) {
      alert("Please select price type");
      return false;
    }
    if (!formData.date) {
      alert("Please select date");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleAddItem = (item: Item) => {
    if (selectedItems.find((si) => si._id === item._id)) {
      alert("This item is already added.");
      return;
    }

    let selectedPrice;
    if (formData.priceType === "nrp") {
      selectedPrice = item.nrp;
    } else if (formData.priceType === "mrp") {
      selectedPrice = item.mrp;
    } else if (formData.priceType === "manual") {
      selectedPrice = 0; // User will enter manually
    } else {
      selectedPrice = item.mrp;
    }

    const newSelectedItem: SelectedItem = {
      ...item,
      quantity: 1,
      selectedPrice,
    };

    setSelectedItems([...selectedItems, newSelectedItem]);
    setSearchQuery(""); // Clear search after adding
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setSelectedItems(
      selectedItems.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handlePriceChange = (itemId: string, price: number) => {
    if (price < 0) return;

    setSelectedItems(
      selectedItems.map((item) =>
        item._id === itemId ? { ...item, selectedPrice: price } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((item) => item._id !== itemId));
  };

  const calculateTotals = () => {
    const subtotal = selectedItems.reduce(
      (sum, item) => sum + item.selectedPrice * item.quantity,
      0
    );
    const discount = parseFloat(formData.dis) || 0;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;
    const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

    return { subtotal, discountAmount, total, totalQuantity };
  };

  const handleCreateQuotation = async () => {
    if (selectedItems.length === 0) {
      alert("Please add at least one item to continue");
      return;
    }

    // Validate manual prices if manual pricing is selected
    if (formData.priceType === "manual") {
      const hasZeroPrice = selectedItems.some(item => item.selectedPrice === 0);
      if (hasZeroPrice) {
        alert("Please enter prices for all items");
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const { totalQuantity, total } = calculateTotals();

      const quotationData = {
        name: formData.name.trim(),
        number: formData.number.trim(),
        address: formData.address.trim(),
        includeGst: formData.includeGst,
        dis: formData.dis || "0",
        value: formData.priceType,
        quantity: totalQuantity,
        date: formData.date,
        items: selectedItems.map((item) => item._id),
        totalQuantity: totalQuantity,
        totalAmount: total,
        userId: user?.id || '',
      };

      const response = await fetch(API_ROUTES.CREATE_QUOTATION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quotationData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setQuotationId(data.product._id);
        navigate(`/dashboard`);
      } else {
        throw new Error(data.message || "Failed to create quotation");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      alert(`Failed to create quotation: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setFormData({
      name: "",
      number: "",
      address: "",
      includeGst: false,
      dis: "",
      priceType: "",
      date: new Date().toISOString().split("T")[0],
    });
    setSelectedItems([]);
    setQuotationId(null);
    setError(null);
    setSearchQuery("");
  };

  const { subtotal, discountAmount, total, totalQuantity } = calculateTotals();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Progress Steps */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <div className={`flex items-center gap-1.5 sm:gap-2 ${step >= 1 ? 'text-red-700' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${step >= 1 ? 'bg-red-700 text-white' : 'bg-gray-200'}`}>
              {step > 1 ? <CheckCircle size={18} /> : "1"}
            </div>
            <span className="font-semibold text-xs sm:text-base">Customer Details</span>
          </div>
          <div className="w-8 sm:w-16 h-1 bg-gray-300"></div>
          <div className={`flex items-center gap-1.5 sm:gap-2 ${step >= 2 ? 'text-red-700' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${step >= 2 ? 'bg-red-700 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="font-semibold text-xs sm:text-base">Add Products</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center gap-2 mb-4 sm:mb-6 text-sm">
          <AlertCircle size={18} />
          <span>Error: {error}</span>
        </div>
      )}

      {quotationId && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm">
          <strong>✅ Quotation Created Successfully!</strong>
          <p className="text-xs sm:text-sm mt-1">Quotation ID: {quotationId}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* LEFT SIDE - Form/Summary */}
        <div className="space-y-4 sm:space-y-6">
          {step === 1 ? (
            // Step 1: Customer Details Form
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-red-800 mb-4 sm:mb-6">
                Customer Details
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Customer Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="number"
                    value={formData.number}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Address
                  </label>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter complete customer address"
                    rows={3}
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="includeGst"
                    checked={formData.includeGst}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="includeGst" className="font-semibold text-gray-700 text-sm sm:text-base">
                    Include GST in Quotation
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5 sm:mb-2 text-sm sm:text-base">
                      Discount %
                    </label>
                    <input
                      type="number"
                      id="dis"
                      value={formData.dis}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5 sm:mb-2 text-sm sm:text-base">
                      Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Price List Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="priceType"
                    value={formData.priceType}
                    onChange={handleChange}
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="">Select Price Type</option>
                    <option value="nrp">NRP (Net Rate Price)</option>
                    <option value="mrp">MRP (Maximum Retail Price)</option>
                    <option value="manual">Manual Price Entry</option>
                  </select>
                  {formData.priceType === "manual" && (
                    <p className="text-xs text-blue-600 mt-1.5">You'll enter custom prices for each product</p>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="w-full mt-4 sm:mt-6 px-6 py-2.5 sm:py-3 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition shadow-sm flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Next: Add Products
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            // Step 2: Summary
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-3 sm:mb-4">Customer Info</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold">{formData.name}</span>
                  </div>
                  {formData.number && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile:</span>
                      <span className="font-semibold">{formData.number}</span>
                    </div>
                  )}
                  {formData.address && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-semibold text-right max-w-xs">{formData.address}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Include GST:</span>
                    <span className={`font-semibold ${formData.includeGst ? 'text-green-600' : 'text-gray-500'}`}>
                      {formData.includeGst ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price Type:</span>
                    <span className="font-semibold uppercase">
                      {formData.priceType === 'manual' ? 'Manual Entry' : formData.priceType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">{formData.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="w-full mt-3 sm:mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={14} />
                  Edit Details
                </button>
              </div>

              {selectedItems.length > 0 && (
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 rounded-xl shadow-sm border border-red-200">
                  <h3 className="text-base sm:text-lg font-bold text-red-800 mb-3 sm:mb-4">
                    Quotation Summary
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Items:</span>
                      <span className="font-semibold">{selectedItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Quantity:</span>
                      <span className="font-semibold">{totalQuantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                    </div>
                    {parseFloat(formData.dis) > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({formData.dis}%):</span>
                        <span className="font-semibold">-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base sm:text-lg font-bold text-red-800 pt-2 border-t border-red-300">
                      <span>Total Amount:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleCreateQuotation}
                disabled={loading || selectedItems.length === 0}
                className="w-full px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Create Quotation
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - Product Search & Selection */}
        <div className="space-y-4 sm:space-y-6">
          {step === 2 && (
            <>
              {/* Search Bar */}
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <label className="block font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type product name to search..."
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                {/* Search Results */}
                {loadingItems ? (
                  <div className="text-center py-8 text-gray-500 text-sm">Loading...</div>
                ) : searchQuery.trim() !== "" && (
                  <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
                    {filteredItems.length === 0 ? (
                      <p className="text-center text-gray-500 py-4 text-sm">No products found</p>
                    ) : (
                      filteredItems.map((item) => (
                        <div
                          key={item._id}
                          className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition"
                        >
                          <div className="flex gap-3 items-start">
                            {item.image && (
                              <img 
                                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0" 
                                src={item.image} 
                                alt={item.name}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.name}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{item.description}</p>
                              <div className="flex gap-2 mt-1.5">
                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                                  NRP: ₹{item.nrp}
                                </span>
                                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">
                                  MRP: ₹{item.mrp}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddItem(item)}
                              disabled={selectedItems.some((si) => si._id === item._id)}
                              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium flex-shrink-0"
                            >
                              {selectedItems.some((si) => si._id === item._id) ? "Added" : "Add"}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Selected Items */}
              {selectedItems.length > 0 && (
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-3 sm:mb-4">
                    Selected Products ({selectedItems.length})
                  </h3>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {selectedItems.map((item) => (
                      <div
                        key={item._id}
                        className="p-3 sm:p-4 border-2 border-red-200 rounded-lg bg-red-50"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{item.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{item.description}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-600 hover:text-red-800 transition p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          {formData.priceType === "manual" ? (
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                                Price (₹):
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.selectedPrice}
                                onChange={(e) =>
                                  handlePriceChange(item._id, parseFloat(e.target.value) || 0)
                                }
                                placeholder="Enter price"
                                className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Price:
                              </label>
                              <div className="p-2 text-sm sm:text-base font-bold text-gray-900 bg-white rounded-lg border border-gray-300">
                                ₹{item.selectedPrice}
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                              Quantity:
                            </label>
                            <div className="flex w-fit items-center gap-1 bg-white border border-gray-300 rounded-lg p-0.5">
                              <button
                                onClick={() => handleQuantityChange(item._id, Math.max(1, item.quantity - 1))}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 rounded transition"
                              >
                                <Minus size={14} />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(item._id, parseInt(e.target.value) || 1)
                                }
                                className="w-12 sm:w-14 text-center text-sm sm:text-base font-bold border-0 focus:ring-0 outline-none"
                              />
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 rounded transition"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-red-200 text-right">
                          <span className="text-xs sm:text-sm text-gray-600">Item Total: </span>
                          <span className="text-base sm:text-lg font-bold text-red-700">
                            ₹{(item.selectedPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {step === 1 && (
            <div className="bg-gray-50 p-6 sm:p-8 rounded-xl border-2 border-dashed border-gray-300 text-center">
              <PlusCircle size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 text-sm sm:text-base">
                Complete customer details to search and add products
              </p>
            </div>
          )}
        </div>
      </div>

      {quotationId && (
        <div className="mt-6 text-center">
          <button
            onClick={handleReset}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition text-sm sm:text-base"
          >
            Create New Quotation
          </button>
        </div>
      )}
    </div>
  );
}

export default QuotationPage;