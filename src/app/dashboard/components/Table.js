"use client";

import { useState, useEffect } from "react";
import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";

const Table = () => {
  const [items, setItems] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState(null);

  const itemsPerPage = 5;

  // **Modal Controls**
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);

  const openDeleteModal = (id) => {
    setDeletingItemId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeletingItemId(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteItem = async () => {
    try {
      await fetch(`http://localhost:3000/api/products/${deletingItemId}`, {
        method: "DELETE",
      });
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== deletingItemId)
      );
    } catch (error) {
      console.error("Error deleting item:", error);
    }
    closeDeleteModal();
  };

  const openUpdateModal = (item) => {
    setEditingItem(item);
    setIsUpdateModalOpen(true);
  };
  const closeUpdateModal = () => {
    setEditingItem(null);
    setIsUpdateModalOpen(false);
  };

  // **Fetch Data**
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

  // **Sorting**
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = [...items].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // **Pagination**
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // **CRUD Operations**
  // Create
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

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error response:", errorDetails);
        alert(`Error adding item: ${errorDetails.message}`);
        return;
      }

      const { data } = await response.json();
      setItems((prevItems) => [...prevItems, data]);
    } catch (error) {
      console.error("Error adding item:", error);
    }
    closeCreateModal();
  };

  // Update
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

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error response:", errorDetails);
        alert(`Error updating item: ${errorDetails.message}`);
        return;
      }

      const { data } = await response.json();
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === editingItem.id ? data : item))
      );
    } catch (error) {
      console.error("Error updating item:", error);
    }
    closeUpdateModal();
  };

  // Delete
  const deleteItem = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // **Render Table**
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        {/* judul */}
        <h2 className="text-xl font-semibold text-gray-800">
          Product
        </h2>
        {/* button create */}
        <button
          onClick={openCreateModal}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {/* Table */}
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th
              className="px-4 py-2 cursor-pointer text-gray-800"
              onClick={() => requestSort("id")}
            >
              ID{" "}
              {sortConfig.key === "id" &&
                (sortConfig.direction === "ascending" ? "▲" : "▼")}
            </th>
            <th
              className="px-4 py-2 cursor-pointer text-gray-800"
              onClick={() => requestSort("name")}
            >
              Name{" "}
              {sortConfig.key === "name" &&
                (sortConfig.direction === "ascending" ? "▲" : "▼")}
            </th>
            <th
              className="px-4 py-2 cursor-pointer text-gray-800"
              onClick={() => requestSort("price")}
            >
              Price{" "}
              {sortConfig.key === "price" &&
                (sortConfig.direction === "ascending" ? "▲" : "▼")}
            </th>
            <th className="px-4 py-2 text-gray-800">Description</th>
            <th className="px-4 py-2 text-gray-800">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2 text-gray-800">{item.id}</td>
              <td className="border px-4 py-2 text-gray-800">{item.name}</td>
              <td className="border px-4 py-2 text-gray-800">{item.price}</td>
              <td className="border px-4 py-2 text-gray-800">
                {item.description}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => openUpdateModal(item)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal delete */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Are you sure?
            </h3>
            <p className="text-gray-600">
              Do you really want to delete this item? This action cannot be
              undone.
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteItem}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Page {currentPage} of {Math.ceil(items.length / itemsPerPage)}
        </span>
        <div>
          {[...Array(Math.ceil(items.length / itemsPerPage)).keys()].map(
            (page) => (
              <button
                key={page + 1}
                onClick={() => paginate(page + 1)}
                className={`px-3 py-1 mx-1 ${
                  currentPage === page + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {page + 1}
              </button>
            )
          )}
        </div>
      </div>

      {/* Create and Update Modals */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={addItem}
      />
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        onSubmit={updateItem}
        initialData={editingItem}
      />
    </div>
  );
};

export default Table;
