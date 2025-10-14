"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useUnifiedApp } from "@/context/UnifiedAppContext";
import LoginScreen from "@/components/LoginScreen";
import {
  Territory,
  Block,
  Address,
  PhoneNumber,
  AppUser,
  Assignment,
  UserRole,
  CreateTerritoryRequest,
  CreateBlockRequest,
  CreateAddressRequest,
  CreateUserRequest,
  CreateAssignmentRequest,
  TelephoneBulkImport,
  TelephoneStatus,
} from "@/types/unified";

interface UnifiedAdminPanelProps {
  className?: string;
}

type AdminView =
  | "dashboard"
  | "territories"
  | "users"
  | "assignments"
  | "phones"
  | "statistics"
  | "settings";

const UnifiedAdminPanel: React.FC<UnifiedAdminPanelProps> = ({ className }) => {
  const {
    state,
    createTerritory,
    updateTerritory,
    deleteTerritory,
    createBlock,
    updateBlock,
    deleteBlock,
    createAddress,
    updateAddress,
    deleteAddress,
    createPhone,
    updatePhone,
    deletePhone,
    bulkImportPhones,
    createUser,
    updateUser,
    deleteUser,
    promoteUser,
    updateUserCredentials,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    returnAssignment,
    getStats,
    checkUserPermission,
  } = useUnifiedApp();

  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string>("");
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Form states
  const [showCreateTerritoryForm, setShowCreateTerritoryForm] = useState(false);
  const [showCreateBlockForm, setShowCreateBlockForm] = useState(false);
  const [showCreateAddressForm, setShowCreateAddressForm] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalMode, setUserModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [selectedUserForEdit, setSelectedUserForEdit] =
    useState<AppUser | null>(null);
  const [showCreateAssignmentForm, setShowCreateAssignmentForm] =
    useState(false);
  const [showBulkImportForm, setShowBulkImportForm] = useState(false);

  const [territoryForm, setTerritoryForm] = useState<CreateTerritoryRequest>({
    numero: 0,
    descripcion: "",
  });

  const [blockForm, setBlockForm] = useState<CreateBlockRequest>({
    numero: 0,
    territoryId: "",
    notas: "",
  });

  const [addressForm, setAddressForm] = useState<CreateAddressRequest>({
    direccion: "",
    blockId: "",
    notas: "",
  });

  const [userForm, setUserForm] = useState<CreateUserRequest>({
    phoneNumber: "",
    fullName: "",
    role: "conductor",
    notes: "",
  });

  const [assignmentForm, setAssignmentForm] = useState<CreateAssignmentRequest>(
    {
      conductorId: "",
      territoryId: "",
      blockIds: [],
      notas: "",
    }
  );

  const [bulkImportText, setBulkImportText] = useState("");

  const stats = getStats();

  // Reset error/success messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleError = (message: string) => {
    setError(message);
    setIsLoading(false);
  };

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setIsLoading(false);
  };

  // Territory functions
  const handleCreateTerritory = async () => {
    if (!territoryForm.numero) {
      handleError("El número del territorio es requerido");
      return;
    }

    setIsLoading(true);
    try {
      await createTerritory(territoryForm);
      handleSuccess("Territorio creado exitosamente");
      setShowCreateTerritoryForm(false);
      setTerritoryForm({ numero: 0, descripcion: "" });
    } catch (err) {
      handleError(`Error al crear territorio: ${err}`);
    }
  };

  const handleDeleteTerritory = async (territoryId: string) => {
    if (
      !confirm(
        "¿Está seguro de eliminar este territorio? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteTerritory(territoryId);
      handleSuccess("Territorio eliminado exitosamente");
    } catch (err) {
      handleError(`Error al eliminar territorio: ${err}`);
    }
  };

  // Block functions
  const handleCreateBlock = async () => {
    if (!blockForm.numero || !blockForm.territoryId) {
      handleError("El número y territorio son requeridos");
      return;
    }

    setIsLoading(true);
    try {
      await createBlock(blockForm);
      handleSuccess("Manzana creada exitosamente");
      setShowCreateBlockForm(false);
      setBlockForm({ numero: 0, territoryId: "", notas: "" });
    } catch (err) {
      handleError(`Error al crear manzana: ${err}`);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm("¿Está seguro de eliminar esta manzana?")) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteBlock(blockId);
      handleSuccess("Manzana eliminada exitosamente");
    } catch (err) {
      handleError(`Error al eliminar manzana: ${err}`);
    }
  };

  // Address functions
  const handleCreateAddress = async () => {
    if (!addressForm.direccion || !addressForm.blockId) {
      handleError("La dirección y manzana son requeridas");
      return;
    }

    setIsLoading(true);
    try {
      await createAddress(addressForm);
      handleSuccess("Dirección creada exitosamente");
      setShowCreateAddressForm(false);
      setAddressForm({ direccion: "", blockId: "", notas: "" });
    } catch (err) {
      handleError(`Error al crear dirección: ${err}`);
    }
  };

  // User functions
  const handleCreateUser = async () => {
    if (!userForm.phoneNumber || !userForm.fullName) {
      handleError("El teléfono y nombre completo son requeridos");
      return;
    }

    setIsLoading(true);
    try {
      await createUser(userForm);
      handleSuccess("Usuario creado exitosamente");
      setShowUserModal(false);
      setUserForm({
        phoneNumber: "",
        fullName: "",
        role: "conductor",
        notes: "",
      });
    } catch (err) {
      handleError(`Error al crear usuario: ${err}`);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUserForEdit || !userForm.phoneNumber || !userForm.fullName) {
      handleError("El teléfono y nombre completo son requeridos");
      return;
    }

    setIsLoading(true);
    try {
      // Update user information using updateUser
      await updateUser({
        uid: selectedUserForEdit.uid,
        phoneNumber: userForm.phoneNumber,
        fullName: userForm.fullName,
        role: userForm.role as UserRole,
        notes: userForm.notes,
      });

      handleSuccess("Usuario actualizado exitosamente");
      setShowUserModal(false);
      setSelectedUserForEdit(null);
      setUserForm({
        phoneNumber: "",
        fullName: "",
        role: "conductor",
        notes: "",
      });
    } catch (err) {
      handleError(`Error al actualizar usuario: ${err}`);
    }
  };

  const handlePromoteUser = async (uid: string, newRole: UserRole) => {
    if (
      !confirm(`¿Está seguro de cambiar el rol de este usuario a ${newRole}?`)
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await promoteUser(uid, newRole);
      handleSuccess("Rol actualizado exitosamente");
    } catch (err) {
      handleError(`Error al actualizar rol: ${err}`);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm("¿Está seguro de eliminar este usuario?")) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteUser(uid);
      handleSuccess("Usuario eliminado exitosamente");
    } catch (err) {
      handleError(`Error al eliminar usuario: ${err}`);
    }
  };

  // Assignment functions
  const handleCreateAssignment = async () => {
    if (
      !assignmentForm.conductorId ||
      !assignmentForm.territoryId ||
      assignmentForm.blockIds.length === 0
    ) {
      handleError(
        "Conductor, territorio y al menos una manzana son requeridos"
      );
      return;
    }

    setIsLoading(true);
    try {
      await createAssignment(assignmentForm);
      handleSuccess("Asignación creada exitosamente");
      setShowCreateAssignmentForm(false);
      setAssignmentForm({
        conductorId: "",
        territoryId: "",
        blockIds: [],
        notas: "",
      });
    } catch (err) {
      handleError(`Error al crear asignación: ${err}`);
    }
  };

  const handleReturnAssignment = async (assignmentId: string) => {
    const reason = prompt("Razón de devolución (opcional):");

    setIsLoading(true);
    try {
      await returnAssignment(assignmentId, reason || undefined);
      handleSuccess("Asignación devuelta exitosamente");
    } catch (err) {
      handleError(`Error al devolver asignación: ${err}`);
    }
  };

  // Bulk import functions
  const handleBulkImport = async () => {
    if (!bulkImportText.trim()) {
      handleError("Debe ingresar datos para importar");
      return;
    }

    const lines = bulkImportText.trim().split("\n");
    const phones: TelephoneBulkImport[] = [];

    for (const line of lines) {
      const parts = line.split("\t"); // Tab-separated
      if (parts.length >= 3) {
        phones.push({
          nombre: parts[0].trim(),
          direccion: parts[1].trim(),
          telefono: parts[2].trim(),
          estado: (parts[3]?.trim() as TelephoneStatus) || "",
          notas: parts[4]?.trim(),
        });
      }
    }

    if (phones.length === 0) {
      handleError("No se encontraron registros válidos para importar");
      return;
    }

    setIsLoading(true);
    try {
      await bulkImportPhones(phones);
      handleSuccess(`${phones.length} teléfonos importados exitosamente`);
      setShowBulkImportForm(false);
      setBulkImportText("");
    } catch (err) {
      handleError(`Error al importar teléfonos: ${err}`);
    }
  };

  // Phone functions
  const handleUpdatePhoneStatus = async (
    phoneId: string,
    status: TelephoneStatus
  ) => {
    setIsLoading(true);
    try {
      await updatePhone(phoneId, { estado: status, modificadoEn: new Date() });
      handleSuccess("Estado actualizado exitosamente");
    } catch (err) {
      handleError(`Error al actualizar estado: ${err}`);
    }
  };

  // Render functions
  const renderNavigation = () => {
    const menuItems = [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "territories", label: "Territorios", icon: "🗺️" },
      ...(checkUserPermission("users.read")
        ? [{ id: "users", label: "Usuarios", icon: "👥" }]
        : []),
      { id: "assignments", label: "Asignaciones", icon: "📋" },
      { id: "phones", label: "Teléfonos", icon: "📞" },
      { id: "statistics", label: "Estadísticas", icon: "📈" },
      { id: "settings", label: "Configuración", icon: "⚙️" },
    ];

    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as AdminView)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    );
  };

  const renderDashboard = () => (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard Administrativo
        </h2>
        <p className="text-gray-600">Vista general del sistema</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              🗺️
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Territorios</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.territories.total}
              </p>
              <p className="text-xs text-gray-500">
                {stats.territories.active} activos
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              👥
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Usuarios</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.users.total}
              </p>
              <p className="text-xs text-gray-500">
                {stats.users.active} activos
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              📋
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Asignaciones</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.assignments.active}
              </p>
              <p className="text-xs text-gray-500">
                {stats.assignments.completed} completadas
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              📞
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Teléfonos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.phones.total}
              </p>
              <p className="text-xs text-gray-500">
                {stats.phones.contacted} contactados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Acciones Rápidas
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setCurrentView("territories");
                setShowCreateTerritoryForm(true);
              }}
              className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🗺️</div>
                <p className="font-medium text-gray-900">Crear Territorio</p>
                <p className="text-sm text-gray-500">
                  Agregar nuevo territorio
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                setCurrentView("users");
                setUserModalMode("create");
                setShowUserModal(true);
              }}
              className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">👤</div>
                <p className="font-medium text-gray-900">Crear Usuario</p>
                <p className="text-sm text-gray-500">Agregar nuevo usuario</p>
              </div>
            </button>

            <button
              onClick={() => {
                setCurrentView("phones");
                setShowBulkImportForm(true);
              }}
              className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📞</div>
                <p className="font-medium text-gray-900">Importar Teléfonos</p>
                <p className="text-sm text-gray-500">Importación masiva</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTerritories = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestión de Territorios
          </h2>
          <p className="text-gray-600">Administrar territorios y manzanas</p>
        </div>
        <button
          onClick={() => setShowCreateTerritoryForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Crear Territorio
        </button>
      </div>

      {/* Territory Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Territorio
        </label>
        <select
          value={selectedTerritoryId}
          onChange={(e) => setSelectedTerritoryId(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Seleccionar Territorio --</option>
          {Object.values(state.territories).map((territory) => (
            <option key={territory.id} value={territory.id}>
              Territorio {territory.numero} -{" "}
              {territory.descripcion || "Sin descripción"}
            </option>
          ))}
        </select>
      </div>

      {/* Territory Details */}
      {selectedTerritoryId && state.territories[selectedTerritoryId] && (
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Territorio {state.territories[selectedTerritoryId].numero}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowCreateBlockForm(true)}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  + Agregar Manzana
                </button>
                <button
                  onClick={() => handleDeleteTerritory(selectedTerritoryId)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Eliminar Territorio
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Información</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Número:</strong>{" "}
                    {state.territories[selectedTerritoryId].numero}
                  </div>
                  <div>
                    <strong>Descripción:</strong>{" "}
                    {state.territories[selectedTerritoryId].descripcion ||
                      "No disponible"}
                  </div>
                  <div>
                    <strong>Total Manzanas:</strong>{" "}
                    {state.territories[selectedTerritoryId].totalManzanas}
                  </div>
                  <div>
                    <strong>Estado:</strong>
                    <span
                      className={`ml-1 px-2 py-1 rounded text-xs ${
                        state.territories[selectedTerritoryId].activo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {state.territories[selectedTerritoryId].activo
                        ? "Activo"
                        : "Inactivo"}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Manzanas</h4>
                <div className="max-h-40 overflow-y-auto">
                  {Object.values(state.blocks)
                    .filter(
                      (block) => block.territoryId === selectedTerritoryId
                    )
                    .map((block) => (
                      <div
                        key={block.id}
                        className="flex justify-between items-center p-2 border-b"
                      >
                        <span>Manzana {block.numero}</span>
                        <div className="flex space-x-1">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              block.estado === "pendiente"
                                ? "bg-gray-100 text-gray-800"
                                : block.estado === "asignado"
                                ? "bg-blue-100 text-blue-800"
                                : block.estado === "trabajado"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {block.estado}
                          </span>
                          <button
                            onClick={() => handleDeleteBlock(block.id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Territory Form */}
      {showCreateTerritoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Crear Nuevo Territorio
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número del Territorio *
                </label>
                <input
                  type="number"
                  value={territoryForm.numero || ""}
                  onChange={(e) =>
                    setTerritoryForm({
                      ...territoryForm,
                      numero: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={territoryForm.descripcion || ""}
                  onChange={(e) =>
                    setTerritoryForm({
                      ...territoryForm,
                      descripcion: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Descripción del territorio..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateTerritoryForm(false);
                  setTerritoryForm({ numero: 0, descripcion: "" });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTerritory}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Creando..." : "Crear Territorio"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Block Form */}
      {showCreateBlockForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Crear Nueva Manzana</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Manzana *
                </label>
                <input
                  type="number"
                  value={blockForm.numero || ""}
                  onChange={(e) =>
                    setBlockForm({
                      ...blockForm,
                      numero: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Territorio *
                </label>
                <select
                  value={blockForm.territoryId}
                  onChange={(e) =>
                    setBlockForm({
                      ...blockForm,
                      territoryId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Seleccionar Territorio --</option>
                  {Object.values(state.territories).map((territory) => (
                    <option key={territory.id} value={territory.id}>
                      Territorio {territory.numero}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas
                </label>
                <textarea
                  value={blockForm.notas || ""}
                  onChange={(e) =>
                    setBlockForm({
                      ...blockForm,
                      notas: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Notas adicionales..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateBlockForm(false);
                  setBlockForm({ numero: 0, territoryId: "", notas: "" });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateBlock}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Creando..." : "Crear Manzana"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Gestión de Usuarios
            </h2>
            <p className="text-gray-600 mt-2">
              {checkUserPermission("users.create")
                ? "Administrar usuarios y roles (Solo Super Admin)"
                : "Visualizar usuarios (Solo lectura)"}
            </p>
          </div>
          {checkUserPermission("users.create") && (
            <button
              onClick={() => {
                setUserModalMode("create");
                setSelectedUserForEdit(null);
                setShowUserModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              + Crear Usuario
            </button>
          )}
        </div>

        {/* Users List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {Object.values(state.users).map((user, index) => (
                  <tr
                    key={user.uid}
                    className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {(user.fullName || user.displayName)
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {user.fullName || user.displayName}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            {user.phoneNumber || user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-bold rounded-full shadow-sm ${
                          user.role === "super-admin"
                            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                            : user.role === "admin"
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                            : user.role === "conductor"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full shadow-sm ${
                          user.isActive
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                            : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            user.isActive ? "bg-green-200" : "bg-red-200"
                          }`}
                        ></div>
                        {user.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {checkUserPermission("users.promote") ? (
                          <select
                            onChange={(e) => {
                              if (e.target.value !== user.role) {
                                handlePromoteUser(
                                  user.uid,
                                  e.target.value as UserRole
                                );
                              }
                            }}
                            defaultValue={user.role}
                            className="text-xs border rounded px-2 py-1"
                          >
                            <option value="conductor">Conductor</option>
                            <option value="admin">Admin</option>
                            <option value="super-admin">Super Admin</option>
                          </select>
                        ) : (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {user.role}
                          </span>
                        )}

                        {checkUserPermission("users.update") && (
                          <button
                            onClick={() => {
                              setSelectedUserForEdit(user);
                              setUserForm({
                                phoneNumber: user.phoneNumber || "",
                                fullName: user.fullName || "",
                                role: user.role || "conductor",
                                notes: user.notes || "",
                              });
                              setUserModalMode("edit");
                              setShowUserModal(true);
                            }}
                            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 text-sm font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            Editar
                          </button>
                        )}

                        {checkUserPermission("users.delete") && (
                          <button
                            onClick={() => handleDeleteUser(user.uid)}
                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 text-sm font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            Eliminar
                          </button>
                        )}

                        {!checkUserPermission("users.delete") &&
                          !checkUserPermission("users.update") && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm font-medium rounded-md">
                              Solo lectura
                            </span>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Unified User Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200">
              <h3 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-300 pb-3">
                {userModalMode === "create"
                  ? "Crear Nuevo Usuario"
                  : "Editar Usuario"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número de Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={userForm.phoneNumber}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
                    placeholder="+593987654321"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={userForm.fullName}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rol
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        role: e.target.value as UserRole,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
                  >
                    <option value="conductor">Conductor</option>
                    <option value="admin">Admin</option>
                    <option value="super-admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notas
                  </label>
                  <textarea
                    value={userForm.notes || ""}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        notes: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 resize-none"
                    rows={3}
                    placeholder="Notas adicionales..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setUserForm({
                      phoneNumber: "",
                      fullName: "",
                      role: "conductor",
                      notes: "",
                    });
                  }}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={
                    userModalMode === "create"
                      ? handleCreateUser
                      : handleUpdateUser
                  }
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isLoading
                    ? userModalMode === "create"
                      ? "Creando..."
                      : "Actualizando..."
                    : userModalMode === "create"
                    ? "Crear Usuario"
                    : "Actualizar Usuario"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Credentials Form - REMOVED - Now using unified modal */}
      </div>
    </div>
  );

  const renderPhones = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestión de Teléfonos
          </h2>
          <p className="text-gray-600">Administrar números telefónicos</p>
        </div>
        <button
          onClick={() => setShowBulkImportForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          📁 Importar Teléfonos
        </button>
      </div>

      {/* Phone Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-semibold text-gray-900">
            {stats.phones.total}
          </div>
          <div className="text-sm text-gray-600">Total Teléfonos</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-semibold text-green-600">
            {stats.phones.contacted}
          </div>
          <div className="text-sm text-gray-600">Contactados</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-semibold text-yellow-600">
            {stats.phones.pending}
          </div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-semibold text-red-600">
            {stats.phones.blocked}
          </div>
          <div className="text-sm text-gray-600">Bloqueados</div>
        </div>
      </div>

      {/* Phones List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.values(state.phoneNumbers)
                .slice(0, 50)
                .map((phone) => (
                  <tr key={phone.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {phone.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {phone.telefono}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {phone.direccion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={phone.estado}
                        onChange={(e) =>
                          handleUpdatePhoneStatus(
                            phone.id,
                            e.target.value as TelephoneStatus
                          )
                        }
                        className="text-xs border rounded px-2 py-1"
                      >
                        <option value="">Sin estado</option>
                        <option value="Contestaron">Contestaron</option>
                        <option value="No contestaron">No contestaron</option>
                        <option value="Colgaron">Colgaron</option>
                        <option value="No llamar">No llamar</option>
                        <option value="Revisita">Revisita</option>
                        <option value="Estudio">Estudio</option>
                        <option value="Testigo">Testigo</option>
                        <option value="Suspendido">Suspendido</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deletePhone(phone.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Import Form */}
      {showBulkImportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              Importar Teléfonos Masivamente
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Pegue los datos separados por tabulaciones en el formato: Nombre |
              Dirección | Teléfono | Estado | Notas
            </p>
            <textarea
              value={bulkImportText}
              onChange={(e) => setBulkImportText(e.target.value)}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="Juan Pérez	Av. Principal 123	0987654321	Contestaron	Interesado&#10;María García	Calle Secundaria 456	0998765432		&#10;..."
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowBulkImportForm(false);
                  setBulkImportText("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleBulkImport}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Importando..." : "Importar Teléfonos"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStatistics = () => (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Estadísticas del Sistema
        </h2>
        <p className="text-gray-600">Vista detallada de métricas</p>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Territories Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📍 Territorios
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Territorios:</span>
              <span className="font-medium">{stats.territories.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Activos:</span>
              <span className="font-medium text-green-600">
                {stats.territories.active}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Con Asignaciones:</span>
              <span className="font-medium text-blue-600">
                {stats.territories.assigned}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completados:</span>
              <span className="font-medium text-purple-600">
                {stats.territories.completed}
              </span>
            </div>
          </div>
        </div>

        {/* Blocks Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🏘️ Manzanas
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Manzanas:</span>
              <span className="font-medium">{stats.blocks.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Disponibles:</span>
              <span className="font-medium text-green-600">
                {stats.blocks.available}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Asignadas:</span>
              <span className="font-medium text-blue-600">
                {stats.blocks.assigned}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completadas:</span>
              <span className="font-medium text-purple-600">
                {stats.blocks.completed}
              </span>
            </div>
          </div>
        </div>

        {/* Users Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            👥 Usuarios
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Usuarios:</span>
              <span className="font-medium">{stats.users.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Activos:</span>
              <span className="font-medium text-green-600">
                {stats.users.active}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Administradores:</span>
              <span className="font-medium text-red-600">
                {stats.users.admins}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Conductores:</span>
              <span className="font-medium text-blue-600">
                {stats.users.conductores}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Super Admins:</span>
              <span className="font-medium text-purple-600">
                {stats.users.superAdmins}
              </span>
            </div>
          </div>
        </div>

        {/* Phones Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📞 Teléfonos
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Números:</span>
              <span className="font-medium">{stats.phones.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contactados:</span>
              <span className="font-medium text-green-600">
                {stats.phones.contacted}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pendientes:</span>
              <span className="font-medium text-yellow-600">
                {stats.phones.pending}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bloqueados:</span>
              <span className="font-medium text-red-600">
                {stats.phones.blocked}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estudios:</span>
              <span className="font-medium text-blue-600">
                {stats.phones.studies}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Configuración del Sistema
            </h2>
            <p className="text-gray-600 mt-1">
              Administra las configuraciones generales de la aplicación
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuración de Usuario */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">👤</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Perfil de Usuario
                </h3>
              </div>
              <p className="text-gray-700 mb-4">
                Gestiona tu información personal y preferencias de cuenta
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Editar Perfil
              </button>
            </div>

            {/* Configuración de Seguridad */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Seguridad
                </h3>
              </div>
              <p className="text-gray-700 mb-4">
                Administra contraseñas y configuraciones de seguridad
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Configurar
              </button>
            </div>

            {/* Configuración de Notificaciones */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">🔔</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Notificaciones
                </h3>
              </div>
              <p className="text-gray-700 mb-4">
                Controla qué notificaciones recibes y cómo
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Personalizar
              </button>
            </div>

            {/* Configuración del Sistema */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">⚙️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Sistema
                </h3>
              </div>
              <p className="text-gray-700 mb-4">
                Configuraciones avanzadas del sistema y base de datos
              </p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                Avanzado
              </button>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información del Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm font-medium text-gray-500">
                  Versión
                </span>
                <p className="text-lg font-semibold text-gray-900">1.0.0</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm font-medium text-gray-500">
                  Usuario Actual
                </span>
                <p className="text-lg font-semibold text-gray-900">
                  {state.currentUser?.fullName ||
                    state.currentUser?.displayName ||
                    "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm font-medium text-gray-500">Rol</span>
                <p className="text-lg font-semibold text-gray-900">
                  {state.currentUser?.role || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return renderDashboard();
      case "territories":
        return renderTerritories();
      case "users":
        return renderUsers();
      case "phones":
        return renderPhones();
      case "statistics":
        return renderStatistics();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  // Mostrar pantalla de login si no hay usuario autenticado
  if (!state.currentUser || !state.isAuthenticated) {
    return <LoginScreen />;
  }

  // Verificar permisos solo después de estar autenticado
  if (!checkUserPermission("users.read")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600">
            No tiene permisos para acceder al panel de administración.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {renderNavigation()}

      {/* Error/Success Messages */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <div className="flex items-center">
            <span className="mr-2">❌</span>
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            {success}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Procesando...</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderContent()}
    </div>
  );
};

export default UnifiedAdminPanel;
