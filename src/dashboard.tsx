import React, { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Eye,
  Edit,
  Filter,
  AlertCircle,
  ShoppingCart,
  X,
  Save,
  Plus,
  Minus,
  Calendar,
  Phone,
  User,
  Package,
  DollarSign,
  Download,
  MapPin,
  CheckCircle,
  Loader2
} from "lucide-react";
import { handleDownloadPDF } from "./PDFGenerator";

// Get user from localStorage or use null
const getUserFromStorage = () => {
  try {
    const userString = window.localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  } catch {
    return null;
  }
};

// Helper function to calculate product total
const calculateProductTotal = (product:any) => {
  const discountPercent = parseFloat(product.dis) || 0;
  const isNRP = product.value === 'nrp';
  const isMRP = product.value === 'mrp';
  const isManual = product.value === 'manual';
  
  const itemsTotal = (product.items || []).reduce((sum:any, item:any) => {
    let price = 0;
    
    if (isManual) {
      price = item.manualPrice || 0;
    } else if (isNRP) {
      price = item.nrp || 0;
    } else if (isMRP) {
      price = item.mrp || 0;
    }
    
    const quantity = item.quantity || 1;
    return sum + (quantity * price);
  }, 0);
  
  const discountAmount = (itemsTotal * discountPercent) / 100;
  const subtotalAfterDiscount = itemsTotal - discountAmount;
  
  if (product.includeGst === true) {
    const gstAmount = subtotalAfterDiscount * 0.18;
    return subtotalAfterDiscount + gstAmount;
  }
  
  return subtotalAfterDiscount;
};

// Toast Notification Component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[320px] max-w-md`}>
        <Icon size={24} className="flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// PDF Download Progress Modal
const PDFDownloadModal = ({ isOpen, progress, customerName }: { isOpen: boolean; progress: string; customerName: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-scale-in">
        <div className="text-center space-y-6">
          {/* Animated PDF Icon */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
              <Download className="text-red-600 animate-bounce" size={40} />
            </div>
          </div>

          {/* Progress Text */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">Generating PDF</h3>
            <p className="text-sm text-gray-600">
              Preparing quotation for <span className="font-semibold text-red-600">{customerName}</span>
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-white" size={16} />
              </div>
              <span className="text-gray-700">Fetching quotation data</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Loader2 className="w-6 h-6 text-red-600 animate-spin flex-shrink-0" />
              <span className="text-gray-700 font-medium">{progress}</span>
            </div>
          </div>

          {/* Loading Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-loading-bar"></div>
          </div>

          <p className="text-xs text-gray-500">Please wait, this may take a few seconds...</p>
        </div>
      </div>
    </div>
  );
};

function QuotationDashboard() {
  const user = getUserFromStorage();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ? `${process.env.REACT_APP_API_BASE_URL}/api` : '/api';

  const API_ROUTES = {
    GET_ALL_PRODUCTS: `${API_BASE_URL}/products?userId=${user?.id || ''}`,
    GET_PRODUCT: (id:any) => `${API_BASE_URL}/products/${id}?userId=${user?.id || ''}`,
    DELETE_PRODUCT: (id:any) => `${API_BASE_URL}/products/delete/${id}?userId=${user?.id || ''}`,
    UPDATE_PRODUCT: (id:any) => `${API_BASE_URL}/products/edit/${id}`,
    CREATE_PRODUCT: `${API_BASE_URL}/products/add`,
    GET_ALL_ITEMS: `${API_BASE_URL}/items?userId=${user?.id || ''}`,
  };

  const [allProducts, setAllProducts] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<any>("");
  const [fromDate, setFromDate] = useState<any>("");
  const [toDate, setToDate] = useState<any>("");
  const [showSearch, setShowSearch] = useState<any>(false);
  const [loading, setLoading] = useState<any>(true);
  const [error, setError] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<any>(false);
  const [showEditModal, setShowEditModal] = useState<any>(false);
  const [showCreateModal, setShowCreateModal] = useState<any>(false);
  const [showViewModal, setShowViewModal] = useState<any>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [createFormData, setCreateFormData] = useState<any>({
    name: "",
    number: "",
    address: "",
    date: new Date().toISOString().split('T')[0],
    value: "mrp",
    dis: 0,
    includeGst: false,
    items: []
  });
  const [availableItems, setAvailableItems] = useState<any>([]);
  const [showItemSelector, setShowItemSelector] = useState<any>(false);
  const [itemSearchTerm, setItemSearchTerm] = useState<any>("");
  const [isCreateMode, setIsCreateMode] = useState<any>(false);
  
  // 🔥 NEW: PDF Download States
  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfProgress, setPdfProgress] = useState("");
  const [pdfCustomerName, setPdfCustomerName] = useState("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Add custom animations CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes scale-in {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
      @keyframes loading-bar {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(400%);
        }
      }
      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }
      .animate-scale-in {
        animation: scale-in 0.3s ease-out;
      }
      .animate-loading-bar {
        animation: loading-bar 1.5s ease-in-out infinite;
        width: 30%;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);



  useEffect(() => {
    fetchProducts();
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(API_ROUTES.GET_ALL_ITEMS);
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setAvailableItems(data?.items || []);
    } catch (err) {
      console.error("Error fetching items:", err);
      setAvailableItems([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ROUTES.GET_ALL_PRODUCTS);
      const data = await response.json();

      if (response.ok && data.success) {
        setAllProducts(data.products || []);
        filterByLast30Days(data.products || []);
      } else {
        throw new Error(data.message || "Failed to fetch quotations");
      }
    } catch (err:any) {
      setError(err.message);
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByLast30Days = (products:any) => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const filtered = products.filter((p:any) => {
      const productDate = new Date(p.date);
      return productDate >= thirtyDaysAgo && productDate <= today;
    });

    setFilteredProducts(filtered);
    setFromDate(thirtyDaysAgo.toISOString().split("T")[0]);
    setToDate(today.toISOString().split("T")[0]);
  };

  const handleSearch = (e:any) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      applyCurrentDateFilter();
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const filtered = allProducts.filter((p:any) => {
      const productDate = new Date(p.date);
      const inDateRange = productDate >= from && productDate <= to;
      const matchesSearch =
        p.name.toLowerCase().includes(term) ||
        p.number.includes(term) ||
        p._id.toLowerCase().includes(term);
      
      return inDateRange && matchesSearch;
    });
    
    setFilteredProducts(filtered);
  };

  const applyCustomDateFilter = () => {
    if (!fromDate || !toDate) {
      showToast("Please select both dates", "error");
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    if (from > to) {
      showToast("From date cannot be after To date", "error");
      return;
    }

    const filtered = allProducts.filter((p:any) => {
      const productDate = new Date(p.date);
      return productDate >= from && productDate <= to;
    });

    setFilteredProducts(filtered);
    setShowSearch(false);
    setSearchTerm("");
    showToast(`Filtered ${filtered.length} quotations`, "success");
  };

  const applyCurrentDateFilter = () => {
    if (!fromDate || !toDate) return;

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const filtered = allProducts.filter((p:any) => {
      const productDate = new Date(p.date);
      return productDate >= from && productDate <= to;
    });

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    filterByLast30Days(allProducts);
    showToast("Filters cleared", "info");
  };

  const handleDeleteClick = (product:any) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const response = await fetch(API_ROUTES.DELETE_PRODUCT(selectedProduct._id), {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setAllProducts((prev:any) => prev.filter((p:any) => p._id !== selectedProduct._id));
        setFilteredProducts((prev:any) => prev.filter((p:any) => p._id !== selectedProduct._id));
        showToast("Quotation deleted successfully", "success");
      } else {
        throw new Error(data.message || "Failed to delete quotation");
      }
    } catch (err:any) {
      console.error("❌ Error deleting quotation:", err);
      showToast(`Failed to delete: ${err.message}`, "error");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSelectedProduct(null);
    }
  };

  const handleEditClick = (product:any) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      number: product.number,
      address: product.address || "",
      includeGst: product.includeGst === true,
      date: product.date.split('T')[0],
      value: product.value,
      dis: product.dis || 0,
      items: product.items.map((item:any) => ({
        _id: item._id,
        name: item.name,
        description: item.description,
        nrp: item.nrp,
        mrp: item.mrp,
        image: item.image,
        quantity: item.quantity || 1,
        manualPrice: item.manualPrice || 0
      }))
    });
    setShowEditModal(true);
  };

  const handleViewClick = (product:any) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleCreateClick = () => {
    setCreateFormData({
      name: "",
      number: "",
      address: "",
      date: new Date().toISOString().split('T')[0],
      value: "mrp",
      dis: 0,
      includeGst: false,
      items: []
    });
    setShowCreateModal(true);
  };

  const handleEditFormChange = (field:any, value:any) => {
    setEditFormData((prev:any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateFormChange = (field:any, value:any) => {
    setCreateFormData((prev:any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index: number, field: string, value: any, isEdit = true) => {
    const formData = isEdit ? editFormData : createFormData;
    const setFormData = isEdit ? setEditFormData : setCreateFormData;
    
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setFormData((prev:any) => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItemToQuotation = (item:any, isEdit = true) => {
    const formData = isEdit ? editFormData : createFormData;
    const setFormData = isEdit ? setEditFormData : setCreateFormData;

    const isItemAlreadyAdded = formData.items.some(
      (existingItem:any) => existingItem._id === item._id
    );

    if (isItemAlreadyAdded) {
      showToast("Item already added. Update quantity instead.", "error");
      return;
    }

    const newItem = {
      _id: item._id,
      name: item.name,
      description: item.description || "",
      nrp: item.nrp,
      mrp: item.mrp,
      quantity: 1,
      image: item.image || "",
      manualPrice: 0
    };

    setFormData((prev:any) => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    setShowItemSelector(false);
    setItemSearchTerm("");
    showToast(`${item.name} added to quotation`, "success");
  };

  const removeItem = (index:any, isEdit = true) => {
    const setFormData = isEdit ? setEditFormData : setCreateFormData;
    setFormData((prev:any) => ({
      ...prev,
      items: prev.items.filter((_:any, i:any) => i !== index)
    }));
    showToast("Item removed", "info");
  };

  const confirmEdit = async () => {
    if (!selectedProduct || !editFormData) return;

    if (!editFormData.name || !editFormData.number) {
      showToast("Please fill in customer name and phone number", "error");
      return;
    }

    if (editFormData.items.length === 0) {
      showToast("Please add at least one item", "error");
      return;
    }

    setLoading(true);
    try {
      const transformedData = {
        name: editFormData.name,
        number: editFormData.number,
        address: editFormData.address || "",
        includeGst: Boolean(editFormData.includeGst),
        date: editFormData.date,
        value: editFormData.value,
        dis: editFormData.dis.toString(),
        userId: user?.id || '',
        items: editFormData.items.map((item:any) => ({
          _id: item._id,
          quantity: item.quantity || 1,
          manualPrice: item.manualPrice || 0
        }))
      };

      const response = await fetch(API_ROUTES.UPDATE_PRODUCT(selectedProduct._id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Quotation updated successfully", "success");
        fetchProducts();
        setShowEditModal(false);
        setSelectedProduct(null);
        setEditFormData(null);
      } else {
        throw new Error(data.message || "Failed to update quotation");
      }
    } catch (err:any) {
      console.error("❌ Error updating quotation:", err);
      showToast(`Failed to update: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmCreate = async () => {
    if (!createFormData.name || !createFormData.number) {
      showToast("Please fill in customer name and phone number", "error");
      return;
    }

    if (createFormData.items.length === 0) {
      showToast("Please add at least one item", "error");
      return;
    }

    setLoading(true);
    try {
      const transformedData = {
        name: createFormData.name,
        number: createFormData.number,
        address: createFormData.address || "",
        includeGst: Boolean(createFormData.includeGst),
        date: createFormData.date,
        value: createFormData.value,
        dis: createFormData.dis.toString(),
        userId: user?.id || '',
        items: createFormData.items.map((item:any) => ({
          _id: item._id,
          quantity: item.quantity || 1,
          manualPrice: item.manualPrice || 0
        }))
      };

      const response = await fetch(API_ROUTES.CREATE_PRODUCT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Quotation created successfully", "success");
        fetchProducts();
        setShowCreateModal(false);
        setCreateFormData({
          name: "",
          number: "",
          address: "",
          date: new Date().toISOString().split('T')[0],
          value: "mrp",
          dis: 0,
          includeGst: false,
          items: []
        });
      } else {
        throw new Error(data.message || "Failed to create quotation");
      }
    } catch (err:any) {
      console.error("❌ Error creating quotation:", err);
      showToast(`Failed to create: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // // 🔥 ENHANCED PDF Download Function
  const handleDownloadPDF = async (product: any) => {
    try {
      // Validation
      if (!product.items || product.items.length === 0) {
        showToast("Cannot generate PDF: No items in quotation", "error");
        return;
      }

      const token = window.localStorage.getItem('token');
      if (!token) {
        showToast("Please login to download PDF", "error");
        return;
      }

      // Set loading state
      setDownloadingPdfId(product._id);
      setPdfCustomerName(product.name);
      setShowPdfModal(true);
      setPdfProgress("Connecting to server...");

      console.log('📥 Requesting PDF from backend...');
      
      // Simulate progress updates
      setTimeout(() => setPdfProgress("Processing images..."), 500);
      setTimeout(() => setPdfProgress("Generating PDF document..."), 1500);
      setTimeout(() => setPdfProgress("Preparing download..."), 2500);

      // Call backend API
      const url = `${API_BASE_URL}/products/${product._id}/download-pdf?userId=${user?.id || ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.statusText}`);
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      const sanitizedName = product.name.replace(/[^a-z0-9]/gi, '_');
      const filename = `Quotation_${sanitizedName}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      anchor.href = downloadUrl;
      anchor.download = filename;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(downloadUrl);

      console.log('✅ PDF downloaded successfully');
      
      // Hide modal and show success
      setShowPdfModal(false);
      setTimeout(() => {
        showToast(`PDF downloaded: ${filename}`, "success");
      }, 300);

    } catch (error: any) {
      console.error('❌ PDF download error:', error);
      setShowPdfModal(false);
      setTimeout(() => {
        showToast(`Failed to download PDF: ${error.message}`, "error");
      }, 300);
    } finally {
      setDownloadingPdfId(null);
    }
  };

  const showToast = (message: any, type: any) => {
    setToast({ message, type });
  };

  //  const onDownloadClick = (product: any) => {
  //   handleDownloadPDF(
  //     product,
  //     setDownloadingPdfId,
  //     setPdfCustomerName,
  //     setShowPdfModal,
  //     setPdfProgress,
  //     showToast
  //   );
  // };
  const filteredAvailableItems = availableItems.filter((item:any) => 
    item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(itemSearchTerm.toLowerCase()))
  );

  const renderItemForm = (formData:any, isEdit:any) => {
    const handleFormChange = isEdit ? handleEditFormChange : handleCreateFormChange;
    
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Customer Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => handleFormChange('number', e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Enter phone number"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleFormChange('address', e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
              placeholder="Enter customer address"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleFormChange('date', e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Price Type <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.value}
              onChange={(e) => handleFormChange('value', e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="mrp">MRP</option>
              <option value="nrp">NRP</option>
              <option value="manual">Manual Entry</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              value={formData.dis}
              onChange={(e) => handleFormChange('dis', parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.1"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              id={isEdit ? "includeGstEdit" : "includeGstCreate"}
              checked={formData.includeGst === true}
              onChange={(e) => handleFormChange('includeGst', e.target.checked)}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor={isEdit ? "includeGstEdit" : "includeGstCreate"} className="text-xs font-semibold text-gray-700 cursor-pointer">
              Include GST (18%)
            </label>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-gray-900">Items</h4>
            <button
              onClick={() => {
                setIsCreateMode(!isEdit);
                setShowItemSelector(true);
              }}
              className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 text-xs rounded-lg hover:bg-green-700 transition"
            >
              <Plus size={14} />
              Add Item
            </button>
          </div>

          {formData.items.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <ShoppingCart className="mx-auto text-gray-400 mb-2" size={28} />
              <p className="text-xs text-gray-500">No items added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.items.map((item:any, index:any) => {
                let rate = 0;
                if (formData.value === 'manual') {
                  rate = item.manualPrice || 0;
                } else {
                  rate = formData.value === 'nrp' ? (item.nrp || 0) : (item.mrp || 0);
                }
                const itemTotal = (item.quantity || 1) * rate;
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 hover:border-red-500 transition">
                    <div className="flex gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-gray-600 truncate">{item.description}</p>
                            {formData.value !== 'manual' && (
                              <p className="text-xs text-green-600 font-semibold mt-1">
                                Rate: ₹{rate.toLocaleString("en-IN")}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(index, isEdit)}
                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition ml-2"
                            title="Remove Item"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        
                        {formData.value === 'manual' && (
                          <div className="mb-2">
                            <label className="text-xs font-semibold text-gray-700 mb-1 block">
                              Price (₹)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.manualPrice || 0}
                              onChange={(e) => {
                                handleItemChange(index, 'manualPrice', parseFloat(e.target.value) || 0, isEdit);
                              }}
                              placeholder="Enter price"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                          <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-gray-300">
                            <button
                              onClick={() => {
                                const newQty = Math.max(1, (item.quantity || 1) - 1);
                                handleItemChange(index, 'quantity', newQty, isEdit);
                              }}
                              className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-red-100 hover:text-red-600 transition"
                            >
                              <Minus size={12} />
                            </button>
                            <input
                              type="number"
                              value={item.quantity || 1}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                handleItemChange(index, 'quantity', Math.max(1, val), isEdit);
                              }}
                              min="1"
                              className="w-12 text-center text-xs font-bold border-0 bg-transparent focus:ring-0 text-gray-900"
                            />
                            <button
                              onClick={() => {
                                const newQty = (item.quantity || 1) + 1;
                                handleItemChange(index, 'quantity', newQty, isEdit);
                              }}
                              className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-green-100 hover:text-green-600 transition"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-xs text-gray-600 ml-auto bg-green-50 px-2 py-1 rounded-lg border border-green-200">
                            Total: <span className="font-bold text-green-700">
                              ₹{itemTotal.toLocaleString("en-IN")}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* PDF Download Progress Modal */}
      <PDFDownloadModal
        isOpen={showPdfModal}
        progress={pdfProgress}
        customerName={pdfCustomerName}
      />

      <div className="mx-auto space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg flex items-center gap-2 text-sm m-4">
            <AlertCircle size={16} />
            <span>Error: {error}</span>
          </div>
        )}

        <div className="bg-white sticky top-0 z-10 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, phone, or ID..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center gap-1.5 bg-red-800 text-white px-3 py-2 text-sm rounded-lg hover:bg-red-900 transition whitespace-nowrap"
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Date Filter</span>
              </button>

              {(searchTerm || (fromDate && toDate)) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 bg-gray-200 text-gray-700 px-3 py-2 text-sm rounded-lg hover:bg-gray-300 transition"
                >
                  <X size={16} />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}

              <button
                onClick={handleCreateClick}
                className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-green-700 transition font-medium whitespace-nowrap"
              >
                <Plus size={16} />
                New
              </button>
            </div>
          </div>

          {showSearch && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <button
                  onClick={applyCustomDateFilter}
                  className="bg-red-800 text-white px-4 py-2 text-sm rounded-lg hover:bg-red-900 transition whitespace-nowrap"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          <div className="mt-2 text-xs text-gray-600">
            Showing {filteredProducts.length} quotation{filteredProducts.length !== 1 ? 's' : ''}
            {fromDate && toDate && (
              <span>
                {" "}from <strong>{new Date(fromDate).toLocaleDateString("en-IN")}</strong> to{" "}
                <strong>{new Date(toDate).toLocaleDateString("en-IN")}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="bg-white border m-3 sm:m-6 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-red-800 border-t-transparent"></div>
              <p className="mt-3 text-sm text-gray-600">Loading quotations...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="mx-auto text-gray-400 mb-3" size={40} />
              <p className="text-gray-600 text-base">No quotations found</p>
              <p className="text-gray-500 text-xs mt-2">Try adjusting your filters or create a new quotation</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Disc%</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Type</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">GST</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Items</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product:any) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition">
                      <td className="px-3 py-2 text-xs text-gray-700 whitespace-nowrap">
                        {new Date(product.date).toLocaleDateString("en-IN", {
                          day: '2-digit',
                          month: 'short',
                          year: '2-digit'
                        })}
                      </td>
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-900 text-xs truncate max-w-[150px]">{product.name}</div>
                        <div className="text-xs text-gray-500">ID: {product._id.slice(-6).toUpperCase()}</div>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-700">{product.number}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {product.dis || 0}%
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium uppercase ${
                          product.value === "mrp" ? "bg-purple-100 text-purple-800" : 
                          product.value === "nrp" ? "bg-green-100 text-green-800" : 
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {product.value}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        {product.includeGst === true ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center text-xs text-gray-700">{product.items?.length || 0}</td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-900 text-xs whitespace-nowrap">
                        ₹{calculateProductTotal(product).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleEditClick(product)}
                            disabled={downloadingPdfId === product._id}
                            className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDownloadPDF(product)}
                            disabled={downloadingPdfId === product._id || !product.items?.length}
                            className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed relative"
                            title={!product.items?.length ? "No items to download" : "Download PDF"}
                          >
                            {downloadingPdfId === product._id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Download size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => handleViewClick(product)}
                            disabled={downloadingPdfId === product._id}
                            className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            disabled={downloadingPdfId === product._id}
                            className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-4 sm:p-6 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Plus className="text-green-600" size={20} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Create New Quotation</h3>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateFormData({
                      name: "",
                      number: "",
                      address: "",
                      date: new Date().toISOString().split('T')[0],
                      value: "mrp",
                      dis: 0,
                      includeGst: false,
                      items: []
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {renderItemForm(createFormData, false)}
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={confirmCreate}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 text-sm rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? "Creating..." : "Create Quotation"}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateFormData({
                      name: "",
                      number: "",
                      address: "",
                      date: new Date().toISOString().split('T')[0],
                      value: "mrp",
                      dis: 0,
                      includeGst: false,
                      items: []
                    });
                  }}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 text-sm rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedProduct && editFormData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-4 sm:p-6 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Edit className="text-red-600" size={20} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Edit Quotation</h3>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setEditFormData(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {renderItemForm(editFormData, true)}
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={confirmEdit}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 text-sm rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setEditFormData(null);
                  }}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 text-sm rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowViewModal(false)}>
            <div 
              className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-red-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10 rounded-t-2xl">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Eye size={20} />
                  <div>
                    <h2 className="text-base sm:text-xl font-bold">Quotation Details</h2>
                    <p className="text-red-100 text-xs">#{selectedProduct._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <User className="text-red-600" size={14} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Customer</p>
                        <p className="font-semibold text-sm text-gray-900 truncate">{selectedProduct.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Phone className="text-green-600" size={14} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-semibold text-sm text-gray-900 truncate">{selectedProduct.number}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-blue-600" size={14} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                          {new Date(selectedProduct.date).toLocaleDateString("en-IN", {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <DollarSign className="text-purple-600" size={14} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Price Type</p>
                        <p className="font-semibold text-sm text-gray-900 uppercase">{selectedProduct.value}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedProduct.address && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-start gap-2">
                      <MapPin className="text-blue-600 mt-0.5" size={14} />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Address</p>
                        <p className="text-sm text-gray-900">{selectedProduct.address}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <p className="text-xs text-red-600 mb-1">Discount</p>
                    <p className="text-xl sm:text-2xl font-bold text-red-600">{selectedProduct.dis || 0}%</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-green-600 mb-1">Total Amount</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">
                      ₹{calculateProductTotal(selectedProduct).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                    <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <Package className="text-red-600" size={16} />
                      Items ({selectedProduct.items?.length || 0})
                    </h3>
                  </div>
                  
                  {selectedProduct.items && selectedProduct.items.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {selectedProduct.items.map((item:any, index:any) => {
                        const rate = selectedProduct.value === 'manual' ? (item?.manualPrice || 0) : selectedProduct.value === 'nrp' ? (item.nrp || 0) : (item.mrp || 0);
                        const quantity = item.quantity || 1;
                        const itemTotal = rate * quantity;
                        
                        return (
                          <div key={index} className="p-3 sm:p-4 hover:bg-gray-50 transition">
                            <div className="flex gap-2 sm:gap-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded border border-gray-200"
                                />
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-sm text-gray-900 truncate">{item.name}</h4>
                                    {item.description && (
                                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                                    )}
                                  </div>
                                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold ml-2">
                                    #{index + 1}
                                  </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-1.5 text-xs">
                                  <div className="bg-blue-50 rounded px-2 py-1 border border-blue-200">
                                    <span className="text-blue-600 font-medium">Qty: {quantity}</span>
                                  </div>
                                  <div className="bg-purple-50 rounded px-2 py-1 border border-purple-200">
                                    <span className="text-purple-600 font-medium">₹{rate.toLocaleString("en-IN")}</span>
                                  </div>
                                  <div className="bg-green-50 rounded px-2 py-1 border border-green-200">
                                    <span className="text-green-600 font-semibold">₹{itemTotal.toLocaleString("en-IN")}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <ShoppingCart className="mx-auto text-gray-300 mb-2" size={36} />
                      <p className="text-gray-500 text-xs">No items in this quotation</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 space-y-2 text-sm">
                  {(() => {
                    const itemsTotal = (selectedProduct.items || []).reduce((sum:any, item:any) => {
                      let price = 0;
                      if (selectedProduct.value === 'nrp') {
                        price = item.nrp || 0;
                      } else if (selectedProduct.value === 'mrp') {
                        price = item.mrp || 0;
                      } else if (selectedProduct.value === 'manual') {
                        price = item.manualPrice || 0;
                      }
                      const quantity = item.quantity || 1;
                      return sum + (quantity * price);
                    }, 0);
                    const discountPercent = parseFloat(selectedProduct.dis) || 0;
                    const discountAmount = (itemsTotal * discountPercent) / 100;
                    const taxable = itemsTotal - discountAmount;
                    const includeGst = selectedProduct.includeGst === true;
                    const gst = includeGst ? taxable * 0.18 : 0;
                    const grandTotal = taxable + gst;

                    return (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold text-gray-900">₹{itemsTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                        </div>
                        {discountPercent > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Discount ({discountPercent}%)</span>
                            <span className="font-semibold text-red-600">-₹{discountAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Taxable Amount</span>
                          <span className="font-semibold text-gray-900">₹{taxable.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                        </div>
                        {includeGst && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">GST (18%)</span>
                            <span className="font-semibold text-green-600">₹{gst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-gray-300 flex justify-between">
                          <span className="font-bold text-gray-900">Grand Total</span>
                          <span className="font-bold text-lg sm:text-xl text-red-600">
                            ₹{grandTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEditClick(selectedProduct);
                    }}
                    disabled={downloadingPdfId === selectedProduct._id}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 text-sm rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(selectedProduct)}
                    disabled={downloadingPdfId === selectedProduct._id || !selectedProduct.items || selectedProduct.items.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 text-sm rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadingPdfId === selectedProduct._id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="text-red-600" size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Are you sure you want to delete this quotation?</p>
              <p className="text-xs text-gray-500 mb-6">
                Customer: <strong>{selectedProduct.name}</strong><br />
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-2 text-sm rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                  }}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 text-sm rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Item Selector Modal */}
        {showItemSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-600 to-red-700 text-white">
                <h3 className="text-lg font-bold">Select Item to Add</h3>
                <button
                  onClick={() => {
                    setShowItemSelector(false);
                    setItemSearchTerm("");
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-3 sm:p-4 border-b bg-gray-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search items by name or description..."
                    value={itemSearchTerm}
                    onChange={(e) => setItemSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
                {filteredAvailableItems.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="mx-auto text-gray-400 mb-3" size={40} />
                    <p className="text-sm text-gray-600">
                      {availableItems.length === 0 ? "No items available" : "No items match your search"}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Try a different search term</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredAvailableItems.map((item: any) => (
                      <div
                        key={item._id}
                        className="border border-gray-200 rounded-lg p-3 hover:border-green-500 hover:shadow-lg transition cursor-pointer group"
                        onClick={() => addItemToQuotation(item, !isCreateMode)}
                      >
                        {item.image && (
                          <div className="relative overflow-hidden rounded-lg mb-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-24 sm:h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <h4 className="font-bold text-sm text-gray-900 mb-1 group-hover:text-green-600 transition truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                        
                        <div className="flex gap-2 text-xs mb-2">
                          <span className="bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-purple-700">
                            MRP: ₹{item.mrp}
                          </span>
                          <span className="bg-green-50 px-2 py-0.5 rounded border border-green-200 text-green-700">
                            NRP: ₹{item.nrp}
                          </span>
                        </div>
                        
                        <div className="text-center">
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium group-hover:text-green-700">
                            <Plus size={12} /> Click to add
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuotationDashboard;