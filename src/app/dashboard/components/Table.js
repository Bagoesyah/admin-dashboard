"use client";

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";

const Table = () => {
  const [items, setItems] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const { data } = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // CRUD Operations
  const addItem = async (newItem) => {
    try {
      const preparedItem = {
        name: newItem.name,
        price: parseInt(newItem.price, 10),
        description: newItem.description,
      };
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preparedItem),
      });
      const { data } = await response.json();
      setItems((prevItems) => [...prevItems, data]);
    } catch (error) {
      console.error("Error adding item:", error);
    }
    setIsCreateModalOpen(false);
  };

  const updateItem = async (updatedItem) => {
    try {
      const preparedItem = {
        name: updatedItem.name,
        price: parseInt(updatedItem.price, 10),
        description: updatedItem.description,
      };
      const response = await fetch(
        `http://localhost:3000/api/products/${editingItem.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preparedItem),
        }
      );
      const { data } = await response.json();
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === editingItem.id ? data : item))
      );
    } catch (error) {
      console.error("Error updating item:", error);
    }
    setIsUpdateModalOpen(false);
  };

  const deleteItem = async () => {
    try {
      await fetch(`http://localhost:3000/api/products/${deletingItem.id}`, {
        method: "DELETE",
      });
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== deletingItem.id)
      );
    } catch (error) {
      console.error("Error deleting item:", error);
    }
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
  };

  // DataTable columns configuration
  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Price", selector: (row) => row.price, sortable: true },
    { name: "Description", selector: (row) => row.description, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            onClick={() => {
              setEditingItem(row);
              setIsUpdateModalOpen(true);
            }}
            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setDeletingItem(row);
              setIsDeleteModalOpen(true);
            }}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Filtered Data Based on Search
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Product</h2>
        <div className="flex gap-2 justify-center align-middle">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search..."
            className="mb-4 p-2 border border-gray-300 rounded w-full text-gray-800"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>

      {/* DataTable Component */}
      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        highlightOnHover
        defaultSortField="id"
      />

      {/* Modals */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={addItem}
      />
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={updateItem}
        initialData={editingItem}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Confirm Delete
            </h3>
            <p className="text-gray-600">
              Are you sure you want to delete {deletingItem?.name}?
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={deleteItem}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
