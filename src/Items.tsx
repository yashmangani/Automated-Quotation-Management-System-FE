// // import React, { useState, useEffect } from "react";
// // import { PlusCircle, Trash2, Upload, X, Edit2, Save, XCircle } from "lucide-react";

// // // =============================================
// // // TYPES
// // // =============================================
// // interface Item {
// //   _id: string;
// //   name: string;
// //   description: string;
// //   nrp: number;
// //   mrp: number;
// //   image?: string | null;
// //   createdAt?: string;
// //   updatedAt?: string;
// // }

// // interface FormData {
// //   name: string;
// //   description: string;
// //   nrp: string;
// //   mrp: string;
// //   image: File | null;
// // }

// // let userString = localStorage.getItem("user");
// // let user = typeof userString === 'string' ? JSON.parse(userString) : null;
// // const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/items?userId=${user?.id}`; // ✅ backend endpoint

// // // =============================================
// // // API ROUTES - UPDATE THESE WITH YOUR BACKEND URL
// // // =============================================
// // const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api`;
// // const API_ROUTES = {
// //   GET_ALL_ITEMS: `${API_BASE_URL}/items?userId=${user?.id}`,
// //   ADD_ITEM: `${API_BASE_URL}/items`,
// //   UPDATE_ITEM: (id: string) => `${API_BASE_URL}/items/${id}`, // PUT/PATCH - Update item
// //   DELETE_ITEM: (id: string) => `${API_BASE_URL}/items/${id}?userId=${user?.id}`, // DELETE - Delete item
// // };
// // // =============================================

// // function ItemsPage() {
// //   const [items, setItems] = useState<Item[]>([]);
// //   const [form, setForm] = useState<FormData>({
// //     name: "",
// //     description: "",
// //     nrp: "",
// //     mrp: "",
// //     image: null,
// //   });
// //   const [imagePreview, setImagePreview] = useState<string | null>(null);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [error, setError] = useState<string | null>(null);
  
// //   // Edit mode states
// //   const [editingId, setEditingId] = useState<string | null>(null);
// //   const [isEditMode, setIsEditMode] = useState<boolean>(false);

// //   useEffect(() => {
// //     fetchItems();
// //   }, []);

// //   // =============================================
// //   // API FUNCTION: Fetch all items
// //   // =============================================
// //   const fetchItems = async (): Promise<void> => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const response = await fetch(API_ROUTES.GET_ALL_ITEMS);
// //       if (!response.ok) throw new Error("Failed to fetch items");
// //       const data = await response.json();
// //       console.log(data, "data::::");
// //       setItems(data?.items || []);
// //     } catch (err) {
// //       const errorMessage = err instanceof Error ? err.message : "Unknown error";
// //       setError(errorMessage);
// //       console.error("Error fetching items:", err);
// //       setItems([
// //         { 
// //           _id: "1", 
// //           name: "Tile A1", 
// //           description: "Premium tiles", 
// //           nrp: 100, 
// //           mrp: 120,
// //           image: "https://via.placeholder.com/150"
// //         },
// //         { 
// //           _id: "2", 
// //           name: "Tile B2", 
// //           description: "Standard tiles", 
// //           nrp: 80, 
// //           mrp: 95,
// //           image: "https://via.placeholder.com/150"
// //         }
// //       ]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
// //     const { name, value } = e.target;
// //     setForm((prev) => ({ ...prev, [name]: value }));
// //   };

// //   // =============================================
// //   // IMAGE UPLOAD HANDLER
// //   // =============================================
// //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
// //     const file = e.target.files?.[0];
    
// //     if (file) {
// //       if (!file.type.startsWith('image/')) {
// //         alert('Please select a valid image file');
// //         return;
// //       }

// //       if (file.size > 5 * 1024 * 1024) {
// //         alert('Image size should be less than 5MB');
// //         return;
// //       }

// //       setForm((prev) => ({ ...prev, image: file }));
      
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setImagePreview(reader.result as string);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   // =============================================
// //   // REMOVE IMAGE
// //   // =============================================
// //   const handleRemoveImage = (): void => {
// //     setForm((prev) => ({ ...prev, image: null }));
// //     setImagePreview(null);
// //   };

// //   // =============================================
// //   // API FUNCTION: Add new item
// //   // =============================================
// //   let userString = localStorage.getItem("user");
// // let user = typeof userString === 'string' ? JSON.parse(userString) : null;
// //   const handleAddItem = async (): Promise<void> => {
// //     if (!form.name || !form.description || !form.nrp || !form.mrp) {
// //       alert("Please fill all fields");
// //       return;
// //     }

// //     setLoading(true);
// //     setError(null);
    
// //     try {
// //       const formData = new FormData();
// //       formData.append('name', form.name);
// //       formData.append('description', form.description);
// //       formData.append('nrp', form.nrp);
// //       formData.append('mrp', form.mrp);
// //       formData.append('userId', user?.id || '');
      
// //       if (form.image) {
// //         formData.append('image', form.image);
// //       }

// //       const response = await fetch(API_ROUTES.ADD_ITEM, {
// //         method: "POST",
// //         body: formData,
// //       });

// //       if (!response.ok) throw new Error("Failed to add item");
      
// //       const data = await response.json();
// //       setItems([...items, data.item || data]);
      
// //       setForm({ name: "", description: "", nrp: "", mrp: "", image: null });
// //       setImagePreview(null);
      
// //       alert("Item added successfully!");
// //     } catch (err) {
// //       const errorMessage = err instanceof Error ? err.message : "Unknown error";
// //       setError(errorMessage);
// //       console.error("Error adding item:", err);
// //       alert("Failed to add item. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // =============================================
// //   // START EDIT MODE
// //   // =============================================
// //   const handleStartEdit = (item: Item): void => {
// //     setIsEditMode(true);
// //     setEditingId(item._id);
// //     setForm({
// //       name: item.name,
// //       description: item.description,
// //       nrp: item.nrp.toString(),
// //       mrp: item.mrp.toString(),
// //       image: null,
// //     });
// //     // Set existing image preview if available
// //     if (item.image) {
// //       setImagePreview(item.image);
// //     }
// //     // Scroll to form
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   };

// //   // =============================================
// //   // CANCEL EDIT MODE
// //   // =============================================
// //   const handleCancelEdit = (): void => {
// //     setIsEditMode(false);
// //     setEditingId(null);
// //     setForm({ name: "", description: "", nrp: "", mrp: "", image: null });
// //     setImagePreview(null);
// //   };

// //   // =============================================
// //   // API FUNCTION: Update item
// //   // =============================================
// //   const handleUpdateItem = async (): Promise<void> => {
// //     if (!editingId) return;
    
// //     if (!form.name || !form.description || !form.nrp || !form.mrp) {
// //       alert("Please fill all fields");
// //       return;
// //     }

// //     setLoading(true);
// //     setError(null);
    
// //     try {
// //       const formData = new FormData();
// //       formData.append('name', form.name);
// //       formData.append('description', form.description);
// //       formData.append('nrp', form.nrp);
// //       formData.append('mrp', form.mrp);
// //       formData.append('userId', user?.id || '');
      
// //       // Only append image if a new file was selected
// //       if (form.image) {
// //         formData.append('image', form.image);
// //       }

// //       const response = await fetch(API_ROUTES.UPDATE_ITEM(editingId), {
// //         method: "PUT", // or "PATCH" depending on your backend
// //         body: formData,
// //       });

// //       if (!response.ok) throw new Error("Failed to update item");
      
// //       const data = await response.json();
// //       const updatedItem = data.item || data;
      
// //       // Update items list
// //       setItems(items.map(item => 
// //         item._id === editingId ? updatedItem : item
// //       ));
      
// //       // Reset form and exit edit mode
// //       setForm({ name: "", description: "", nrp: "", mrp: "", image: null });
// //       setImagePreview(null);
// //       setIsEditMode(false);
// //       setEditingId(null);
      
// //       alert("Item updated successfully!");
// //     } catch (err) {
// //       const errorMessage = err instanceof Error ? err.message : "Unknown error";
// //       setError(errorMessage);
// //       console.error("Error updating item:", err);
// //       alert("Failed to update item. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // =============================================
// //   // API FUNCTION: Delete item
// //   // =============================================
// //   const handleDelete = async (id: string): Promise<void> => {
// //     if (!window.confirm("Are you sure you want to delete this item?")) return;

// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const response = await fetch(API_ROUTES.DELETE_ITEM(id), {
// //         method: "DELETE",
// //       });

// //       if (!response.ok) throw new Error("Failed to delete item");
      
// //       setItems(items.filter((item) => item._id !== id));
// //       alert("Item deleted successfully!");
// //     } catch (err) {
// //       const errorMessage = err instanceof Error ? err.message : "Unknown error";
// //       setError(errorMessage);
// //       console.error("Error deleting item:", err);
// //       alert("Failed to delete item. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

 
// //   return (
// //     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
// //       <div className="max-w-7xl mx-auto space-y-6">
// //         {/* Error Message */}
// //         {error && (
// //           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
// //             Error: {error}
// //           </div>
// //         )}

// //         {/* Add/Edit Item Form */}
// //         <div className="bg-white p-6 rounded-xl shadow-sm">
// //           <div className="flex justify-between items-center mb-6">
// //             <h1 className="text-2xl font-bold text-red-800">
// //               {isEditMode ? "Edit Item" : "Add New Item"}
// //             </h1>
// //             {isEditMode && (
// //               <button
// //                 onClick={handleCancelEdit}
// //                 className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
// //               >
// //                 <XCircle size={20} />
// //                 Cancel Edit
// //               </button>
// //             )}
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <div>
// //               <label className="block font-semibold text-gray-700 mb-2">Item Name</label>
// //               <input
// //                 type="text"
// //                 name="name"
// //                 value={form.name}
// //                 onChange={handleChange}
// //                 placeholder="Enter item name"
// //                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
// //                 disabled={loading}
// //               />
// //             </div>

// //             <div>
// //               <label className="block font-semibold text-gray-700 mb-2">Description</label>
// //               <input
// //                 type="text"
// //                 name="description"
// //                 value={form.description}
// //                 onChange={handleChange}
// //                 placeholder="Enter description"
// //                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
// //                 disabled={loading}
// //               />
// //             </div>

// //             <div>
// //               <label className="block font-semibold text-gray-700 mb-2">NRP</label>
// //               <input
// //                 type="number"
// //                 name="nrp"
// //                 value={form.nrp}
// //                 onChange={handleChange}
// //                 placeholder="Enter NRP"
// //                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
// //                 disabled={loading}
// //               />
// //             </div>

// //             <div>
// //               <label className="block font-semibold text-gray-700 mb-2">MRP</label>
// //               <input
// //                 type="number"
// //                 name="mrp"
// //                 value={form.mrp}
// //                 onChange={handleChange}
// //                 placeholder="Enter MRP"
// //                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
// //                 disabled={loading}
// //               />
// //             </div>

// //             {/* Image Upload */}
// //             <div className="md:col-span-2">
// //               <label className="block font-semibold text-gray-700 mb-2">
// //                 Item Image {isEditMode && "(Leave empty to keep existing image)"}
// //               </label>
              
// //               {!imagePreview ? (
// //                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition">
// //                   <input
// //                     type="file"
// //                     accept="image/*"
// //                     onChange={handleImageChange}
// //                     className="hidden"
// //                     id="image-upload"
// //                     disabled={loading}
// //                   />
// //                   <label 
// //                     htmlFor="image-upload" 
// //                     className="cursor-pointer flex flex-col items-center"
// //                   >
// //                     <Upload size={40} className="text-gray-400 mb-2" />
// //                     <span className="text-gray-600 font-medium">Click to upload image</span>
// //                     <span className="text-gray-400 text-sm mt-1">PNG, JPG, JPEG (Max 5MB)</span>
// //                   </label>
// //                 </div>
// //               ) : (
// //                 <div className="relative inline-block">
// //                   <img 
// //                     src={imagePreview} 
// //                     alt="Preview" 
// //                     className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={handleRemoveImage}
// //                     className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
// //                     disabled={loading}
// //                   >
// //                     <X size={20} />
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           <div className="flex justify-center mt-6">
// //             {isEditMode ? (
// //               <button
// //                 onClick={handleUpdateItem}
// //                 disabled={loading}
// //                 className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
// //               >
// //                 <Save size={20} />
// //                 {loading ? "Updating..." : "Update Item"}
// //               </button>
// //             ) : (
// //               <button
// //                 onClick={handleAddItem}
// //                 disabled={loading}
// //                 className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
// //               >
// //                 <PlusCircle size={20} />
// //                 {loading ? "Adding..." : "Add Item"}
// //               </button>
// //             )}
// //           </div>
// //         </div>

// //         {/* Item List */}
// //         {loading && items.length === 0 ? (
// //           <div className="bg-white p-6 rounded-xl shadow-sm text-center">
// //             <p className="text-gray-600">Loading items...</p>
// //           </div>
// //         ) : items.length > 0 ? (
// //           <div className="bg-white p-6 rounded-xl shadow-sm">
// //             <h2 className="text-xl font-semibold text-red-800 mb-4">Item List</h2>
// //             <div className="overflow-x-auto">
// //               <table className="w-full border border-gray-200 rounded-lg">
// //                 <thead className="bg-red-800 text-white">
// //                   <tr>
// //                     <th className="p-3 border">Image</th>
// //                     <th className="p-3 border">Name</th>
// //                     <th className="p-3 border">Description</th>
// //                     <th className="p-3 border">NRP</th>
// //                     <th className="p-3 border">MRP</th>
// //                     <th className="p-3 border">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {items.map((item) => (
// //                     <tr 
// //                       key={item._id} 
// //                       className={`hover:bg-red-50 text-center ${editingId === item._id ? 'bg-yellow-50' : ''}`}
// //                     >
// //                       <td className="p-3 border">
// //                         {item.image ? (
// //                           <img 
// //                             src={item.image} 
// //                             alt={item.name}
// //                             className="w-16 h-16 object-cover rounded-lg mx-auto"
// //                             onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
// //                               e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
// //                             }}
// //                           />
// //                         ) : (
// //                           <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
// //                             <span className="text-gray-400 text-xs">No image</span>
// //                           </div>
// //                         )}
// //                       </td>
// //                       <td className="p-3 border font-semibold">{item.name}</td>
// //                       <td className="p-3 border text-sm">{item.description}</td>
// //                       <td className="p-3 border">₹{item.nrp}</td>
// //                       <td className="p-3 border">₹{item.mrp}</td>
// //                       <td className="p-3 border">
// //                         <div className="flex justify-center gap-2">
// //                           <button
// //                             onClick={() => handleStartEdit(item)}
// //                             disabled={loading}
// //                             className="text-blue-700 hover:text-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
// //                             title="Edit"
// //                           >
// //                             <Edit2 size={20} />
// //                           </button>
// //                           <button
// //                             onClick={() => handleDelete(item._id)}
// //                             disabled={loading}
// //                             className="text-red-700 hover:text-red-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
// //                             title="Delete"
// //                           >
// //                             <Trash2 size={20} />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         ) : (
// //           <div className="bg-white p-6 rounded-xl shadow-sm text-center">
// //             <p className="text-gray-600">No items found. Add your first item above!</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default ItemsPage;

// import React, { useState, useEffect } from "react";
// import { PlusCircle, Trash2, Upload, X, Edit2, Save, XCircle, Search, Package } from "lucide-react";

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
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface FormData {
//   name: string;
//   description: string;
//   nrp: string;
//   mrp: string;
//   image: File | null;
// }

// // Mock user data - replace with actual authentication
// const user = { id: "user123" };
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// const API_ROUTES = {
//   GET_ALL_ITEMS: `${API_BASE_URL}/api/items?userId=${user?.id}`,
//   ADD_ITEM: `${API_BASE_URL}/api/items`,
//   UPDATE_ITEM: (id: string) => `${API_BASE_URL}/api/items/${id}`,
//   DELETE_ITEM: (id: string) => `${API_BASE_URL}/api/items/${id}?userId=${user?.id}`,
// };

// function ItemsPage() {
//   const [items, setItems] = useState<Item[]>([]);
//   const [form, setForm] = useState<FormData>({
//     name: "",
//     description: "",
//     nrp: "",
//     mrp: "",
//     image: null,
//   });
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>("");
  
//   // Edit mode states
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [isEditMode, setIsEditMode] = useState<boolean>(false);
//   const [showForm, setShowForm] = useState<boolean>(false);

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   // =============================================
//   // API FUNCTION: Fetch all items
//   // =============================================
//   const fetchItems = async (): Promise<void> => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(API_ROUTES.GET_ALL_ITEMS);
//       if (!response.ok) throw new Error("Failed to fetch items");
//       const data = await response.json();
//       setItems(data?.items || []);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Unknown error";
//       setError(errorMessage);
//       console.error("Error fetching items:", err);
//       // Mock data for demo
//       setItems([
//         { 
//           _id: "1", 
//           name: "Premium Tile A1", 
//           description: "High quality ceramic tiles", 
//           nrp: 100, 
//           mrp: 120,
//           image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=150"
//         },
//         { 
//           _id: "2", 
//           name: "Standard Tile B2", 
//           description: "Durable floor tiles", 
//           nrp: 80, 
//           mrp: 95,
//           image: "https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=150"
//         },
//         { 
//           _id: "3", 
//           name: "Luxury Marble C3", 
//           description: "Italian marble finish", 
//           nrp: 200, 
//           mrp: 250,
//           image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=150"
//         }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//     const file = e.target.files?.[0];
    
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         alert('Please select a valid image file');
//         return;
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         alert('Image size should be less than 5MB');
//         return;
//       }

//       setForm((prev) => ({ ...prev, image: file }));
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage = (): void => {
//     setForm((prev) => ({ ...prev, image: null }));
//     setImagePreview(null);
//   };

//   const handleAddItem = async (): Promise<void> => {
//     if (!form.name || !form.description || !form.nrp || !form.mrp) {
//       alert("Please fill all required fields");
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const formData = new FormData();
//       formData.append('name', form.name);
//       formData.append('description', form.description);
//       formData.append('nrp', form.nrp);
//       formData.append('mrp', form.mrp);
//       formData.append('userId', user?.id || '');
      
//       if (form.image) {
//         formData.append('image', form.image);
//       }

//       const response = await fetch(API_ROUTES.ADD_ITEM, {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Failed to add item");
      
//       const data = await response.json();
//       setItems([data.item || data, ...items]);
      
//       resetForm();
//       alert("Item added successfully!");
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Unknown error";
//       setError(errorMessage);
//       console.error("Error adding item:", err);
//       alert("Failed to add item. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStartEdit = (item: Item): void => {
//     setIsEditMode(true);
//     setEditingId(item._id);
//     setShowForm(true);
//     setForm({
//       name: item.name,
//       description: item.description,
//       nrp: item.nrp.toString(),
//       mrp: item.mrp.toString(),
//       image: null,
//     });
//     if (item.image) {
//       setImagePreview(item.image);
//     }
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const resetForm = (): void => {
//     setIsEditMode(false);
//     setEditingId(null);
//     setShowForm(false);
//     setForm({ name: "", description: "", nrp: "", mrp: "", image: null });
//     setImagePreview(null);
//   };

//   const handleUpdateItem = async (): Promise<void> => {
//     if (!editingId) return;
    
//     if (!form.name || !form.description || !form.nrp || !form.mrp) {
//       alert("Please fill all required fields");
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const formData = new FormData();
//       formData.append('name', form.name);
//       formData.append('description', form.description);
//       formData.append('nrp', form.nrp);
//       formData.append('mrp', form.mrp);
//       formData.append('userId', user?.id || '');
      
//       if (form.image) {
//         formData.append('image', form.image);
//       }

//       const response = await fetch(API_ROUTES.UPDATE_ITEM(editingId), {
//         method: "PUT",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Failed to update item");
      
//       const data = await response.json();
//       const updatedItem = data.item || data;
      
//       setItems(items.map(item => 
//         item._id === editingId ? updatedItem : item
//       ));
      
//       resetForm();
//       alert("Item updated successfully!");
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Unknown error";
//       setError(errorMessage);
//       console.error("Error updating item:", err);
//       alert("Failed to update item. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string): Promise<void> => {
//     if (!window.confirm("Are you sure you want to delete this item?")) return;

//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(API_ROUTES.DELETE_ITEM(id), {
//         method: "DELETE",
//       });

//       if (!response.ok) throw new Error("Failed to delete item");
      
//       setItems(items.filter((item) => item._id !== id));
//       alert("Item deleted successfully!");
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Unknown error";
//       setError(errorMessage);
//       console.error("Error deleting item:", err);
//       alert("Failed to delete item. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredItems = items.filter(item =>
//     item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     item.description.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Package className="text-red-600" size={24} />
//               <h1 className="text-lg sm:text-xl font-bold text-gray-800">Items Management</h1>
//             </div>
//             <button
//               onClick={() => setShowForm(!showForm)}
//               className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-sm"
//             >
//               <PlusCircle size={16} />
//               <span className="hidden sm:inline">Add New</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4">
//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
//             <strong>Error:</strong> {error}
//           </div>
//         )}

//         {/* Add/Edit Form - Collapsible */}
//         {showForm && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 flex justify-between items-center">
//               <h2 className="text-base font-semibold text-white flex items-center gap-2">
//                 {isEditMode ? <Edit2 size={16} /> : <PlusCircle size={16} />}
//                 {isEditMode ? "Edit Item" : "Add New Item"}
//               </h2>
//               <button
//                 onClick={resetForm}
//                 className="text-white hover:text-red-100 transition"
//               >
//                 <XCircle size={20} />
//               </button>
//             </div>

//             <div className="p-4 sm:p-5">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">
//                     Item Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={form.name}
//                     onChange={handleChange}
//                     placeholder="e.g., Premium Tile A1"
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="description"
//                     value={form.description}
//                     onChange={handleChange}
//                     placeholder="e.g., High quality ceramic"
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">
//                     NRP (₹) <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     name="nrp"
//                     value={form.nrp}
//                     onChange={handleChange}
//                     placeholder="100"
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">
//                     MRP (₹) <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     name="mrp"
//                     value={form.mrp}
//                     onChange={handleChange}
//                     placeholder="120"
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="block text-xs font-medium text-gray-700 mb-1">
//                     Item Image {isEditMode && <span className="text-gray-500 font-normal">(optional)</span>}
//                   </label>
                  
//                   {!imagePreview ? (
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-red-500 transition">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="hidden"
//                         id="image-upload"
//                         disabled={loading}
//                       />
//                       <label 
//                         htmlFor="image-upload" 
//                         className="cursor-pointer flex flex-col items-center"
//                       >
//                         <Upload size={28} className="text-gray-400 mb-1" />
//                         <span className="text-xs text-gray-600 font-medium">Click to upload</span>
//                         <span className="text-xs text-gray-400 mt-0.5">PNG, JPG (Max 5MB)</span>
//                       </label>
//                     </div>
//                   ) : (
//                     <div className="relative inline-block">
//                       <img 
//                         src={imagePreview} 
//                         alt="Preview" 
//                         className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
//                       />
//                       <button
//                         type="button"
//                         onClick={handleRemoveImage}
//                         className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition shadow-md"
//                         disabled={loading}
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex gap-2 mt-4 pt-4 border-t">
//                 <button
//                   onClick={resetForm}
//                   disabled={loading}
//                   className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={isEditMode ? handleUpdateItem : handleAddItem}
//                   disabled={loading}
//                   className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition shadow-sm"
//                 >
//                   {isEditMode ? <Save size={16} /> : <PlusCircle size={16} />}
//                   {loading ? "Processing..." : isEditMode ? "Update" : "Add Item"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Search Bar */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type="text"
//               placeholder="Search items by name or description..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
//             />
//           </div>
//         </div>

//         {/* Items Grid */}
//         {loading && items.length === 0 ? (
//           <div className="bg-white p-8 rounded-xl shadow-sm text-center">
//             <div className="animate-pulse">
//               <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
//             </div>
//           </div>
//         ) : filteredItems.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//             {filteredItems.map((item) => (
//               <div 
//                 key={item._id} 
//                 className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden ${
//                   editingId === item._id ? 'ring-2 ring-yellow-400 border-yellow-400' : 'border-gray-200'
//                 }`}
//               >
//                 <div className="aspect-video bg-gray-100 relative overflow-hidden">
//                   {item.image ? (
//                     <img 
//                       src={item.image} 
//                       alt={item.name}
//                       className="w-full h-full object-cover"
//                       onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
//                         e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
//                       }}
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <Package className="text-gray-300" size={48} />
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="p-3 sm:p-4">
//                   <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">{item.name}</h3>
//                   <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="space-y-0.5">
//                       <div className="text-xs text-gray-500">NRP</div>
//                       <div className="text-sm font-semibold text-gray-800">₹{item.nrp}</div>
//                     </div>
//                     <div className="space-y-0.5 text-right">
//                       <div className="text-xs text-gray-500">MRP</div>
//                       <div className="text-sm font-semibold text-red-600">₹{item.mrp}</div>
//                     </div>
//                   </div>
                  
//                   <div className="flex gap-2 pt-3 border-t border-gray-100">
//                     <button
//                       onClick={() => handleStartEdit(item)}
//                       disabled={loading}
//                       className="flex-1 flex items-center justify-center gap-1.5 text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50"
//                     >
//                       <Edit2 size={14} />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(item._id)}
//                       disabled={loading}
//                       className="flex-1 flex items-center justify-center gap-1.5 text-red-600 hover:bg-red-50 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50"
//                     >
//                       <Trash2 size={14} />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white p-8 sm:p-12 rounded-xl shadow-sm text-center">
//             <Package className="mx-auto text-gray-300 mb-3" size={48} />
//             <p className="text-gray-600 text-sm">
//               {searchQuery ? "No items match your search" : "No items yet. Add your first item!"}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ItemsPage;

import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Upload, X, Edit2, Save, XCircle, Search, Package, Grid3x3, List, Filter, SlidersHorizontal, ChevronDown } from "lucide-react";

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
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  name: string;
  description: string;
  nrp: string;
  mrp: string;
  image: File | null;
}

// Mock user data
const user = { id: "user123" };
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const API_ROUTES = {
  GET_ALL_ITEMS: `${API_BASE_URL}/api/items?userId=${user?.id}`,
  ADD_ITEM: `${API_BASE_URL}/api/items`,
  UPDATE_ITEM: (id: string) => `${API_BASE_URL}/api/items/${id}`,
  DELETE_ITEM: (id: string) => `${API_BASE_URL}/api/items/${id}?userId=${user?.id}`,
};

function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    nrp: "",
    mrp: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // View states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>('name');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Edit mode states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ROUTES.GET_ALL_ITEMS);
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setItems(data?.items || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching items:", err);
      // Mock data
      setItems([
        { _id: "1", name: "Premium Tile A1", description: "High quality ceramic tiles for flooring", nrp: 100, mrp: 120, image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=300" },
        { _id: "2", name: "Standard Tile B2", description: "Durable floor tiles", nrp: 80, mrp: 95, image: "https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=300" },
        { _id: "3", name: "Luxury Marble C3", description: "Italian marble finish", nrp: 200, mrp: 250, image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=300" },
        { _id: "4", name: "Budget Tile D4", description: "Affordable tiles", nrp: 50, mrp: 60, image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=300" },
        { _id: "5", name: "Designer Tile E5", description: "Modern design patterns", nrp: 150, mrp: 180, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300" },
        { _id: "6", name: "Classic Tile F6", description: "Traditional style tiles", nrp: 90, mrp: 110, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (): void => {
    setForm((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleAddItem = async (): Promise<void> => {
    if (!form.name || !form.description || !form.nrp || !form.mrp) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('nrp', form.nrp);
      formData.append('mrp', form.mrp);
      formData.append('userId', user?.id || '');
      if (form.image) formData.append('image', form.image);

      const response = await fetch(API_ROUTES.ADD_ITEM, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to add item");
      const data = await response.json();
      setItems([data.item || data, ...items]);
      resetForm();
      alert("Item added successfully!");
    } catch (err) {
      console.error("Error adding item:", err);
      alert("Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (item: Item): void => {
    setIsEditMode(true);
    setEditingId(item._id);
    setShowModal(true);
    setForm({
      name: item.name,
      description: item.description,
      nrp: item.nrp.toString(),
      mrp: item.mrp.toString(),
      image: null,
    });
    if (item.image) setImagePreview(item.image);
  };

  const resetForm = (): void => {
    setIsEditMode(false);
    setEditingId(null);
    setShowModal(false);
    setForm({ name: "", description: "", nrp: "", mrp: "", image: null });
    setImagePreview(null);
  };

  const handleUpdateItem = async (): Promise<void> => {
    if (!editingId || !form.name || !form.description || !form.nrp || !form.mrp) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('nrp', form.nrp);
      formData.append('mrp', form.mrp);
      formData.append('userId', user?.id || '');
      if (form.image) formData.append('image', form.image);

      const response = await fetch(API_ROUTES.UPDATE_ITEM(editingId), {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to update item");
      const data = await response.json();
      setItems(items.map(item => item._id === editingId ? (data.item || data) : item));
      resetForm();
      alert("Item updated successfully!");
    } catch (err) {
      console.error("Error updating item:", err);
      alert("Failed to update item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setLoading(true);
    try {
      const response = await fetch(API_ROUTES.DELETE_ITEM(id), { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete item");
      setItems(items.filter((item) => item._id !== id));
      alert("Item deleted successfully!");
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort logic
  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = item.mrp >= priceRange[0] && item.mrp <= priceRange[1];
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-low') return a.mrp - b.mrp;
      if (sortBy === 'price-high') return b.mrp - a.mrp;
      return 0;
    });

  return (
    <div className=" bg-gray-50 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white shadow-sm sticky top-0 border-b z-30 flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="text-red-600" size={24} />
              <h1 className="text-lg font-bold text-gray-800">Items Manager</h1>
            </div>
            <button
              onClick={() => { setShowModal(true); setIsEditMode(false); }}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-sm"
            >
              <PlusCircle size={16} />
              Add Item
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 h-[88vh] overflow-hidden min-h-0">
        {/* Left Sidebar - Filters */}
        <div className={`bg-white border-r  shadow-sm flex-shrink-0 transition-all duration-300 ${showFilters ? 'w-64' : 'w-0'} overflow-hidden flex flex-col`}>
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <SlidersHorizontal size={16} />
                Filters
              </h2>
              <button onClick={() => setShowFilters(false)} className="lg:hidden">
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
              <div className="space-y-1.5">
                {['all', 'premium', 'standard', 'budget'].map(cat => (
                  <label key={cat} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={filterCategory === cat}
                      onChange={() => setFilterCategory(cat)}
                      className="text-red-600"
                    />
                    <span className="capitalize">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSearchQuery('');
                setPriceRange([0, 10000]);
                setSortBy('name');
                setFilterCategory('all');
              }}
              className="w-full py-2 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Toolbar */}
          <div className="bg-white border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              {!showFilters && (
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-sm"
                >
                  <Filter size={16} />
                  Filters
                </button>
              )}
              <span className="text-sm text-gray-600">
                {filteredItems.length} items
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Items Display */}
          <div className="flex-1 h-[87vh] overflow-y-auto p-4 min-h-0">
            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-3"></div>
                  <p className="text-sm text-gray-600">Loading items...</p>
                </div>
              </div>
            ) : filteredItems.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredItems.map((item) => (
                    <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden group">
                      <div className="aspect-video bg-gray-100 relative overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="text-gray-300" size={40} />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm text-gray-800 mb-1 truncate">{item.name}</h3>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2 h-8">{item.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-xs text-gray-500">NRP</div>
                            <div className="text-sm font-semibold text-gray-800">₹{item.nrp}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">MRP</div>
                            <div className="text-sm font-semibold text-red-600">₹{item.mrp}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2 border-t">
                          <button onClick={() => handleStartEdit(item)} className="flex-1 flex items-center justify-center gap-1 text-blue-600 hover:bg-blue-50 py-1.5 rounded text-xs font-medium transition">
                            <Edit2 size={13} /> Edit
                          </button>
                          <button onClick={() => handleDelete(item._id)} className="flex-1 flex items-center justify-center gap-1 text-red-600 hover:bg-red-50 py-1.5 rounded text-xs font-medium transition">
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredItems.map((item) => (
                    <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition p-3 flex gap-3">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="text-gray-300" size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-800 mb-0.5">{item.name}</h3>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-1">{item.description}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">NRP:</span>
                            <span className="text-sm font-semibold text-gray-800">₹{item.nrp}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">MRP:</span>
                            <span className="text-sm font-semibold text-red-600">₹{item.mrp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 justify-center">
                        <button onClick={() => handleStartEdit(item)} className="text-blue-600 hover:bg-blue-50 p-2 rounded transition">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:bg-red-50 p-2 rounded transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <Package className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-sm text-gray-600">No items found</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 px-5 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                {isEditMode ? <Edit2 size={20} /> : <PlusCircle size={20} />}
                {isEditMode ? "Edit Item" : "Add New Item"}
              </h2>
              <button onClick={resetForm} className="text-white hover:text-red-100 transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter item name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    NRP (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="nrp"
                    value={form.nrp}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    MRP (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="mrp"
                    value={form.mrp}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Item Image {isEditMode && <span className="text-gray-500 font-normal">(optional)</span>}
                </label>
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-red-500 transition text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="modal-image-upload"
                      disabled={loading}
                    />
                    <label htmlFor="modal-image-upload" className="cursor-pointer">
                      <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600 font-medium">Click to upload image</span>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (Max 5MB)</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-lg border-2 border-gray-300" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition shadow-lg"
                      disabled={loading}
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={isEditMode ? handleUpdateItem : handleAddItem}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 transition shadow-sm"
                >
                  {isEditMode ? <Save size={18} /> : <PlusCircle size={18} />}
                  {loading ? "Processing..." : isEditMode ? "Update Item" : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemsPage;