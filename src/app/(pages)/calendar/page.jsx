"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  FileText,
  Briefcase,
  X,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Calendar,
} from "lucide-react";
import axios from "axios";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    type: "meeting",
    description: "",
    client_id: "",
    project_id: "",
  });

  const eventTypes = [
    { value: "meeting", label: "Réunion", color: "#3b82f6", icon: User },
    {
      value: "deadline",
      label: "Échéance",
      color: "#ef4444",
      icon: AlertCircle,
    },
    { value: "training", label: "Formation", color: "#8b5cf6", icon: FileText },
    { value: "task", label: "Tâche", color: "#10b981", icon: Check },
    { value: "project", label: "Projet", color: "#f59e0b", icon: Briefcase },
  ];

  useEffect(() => {
    fetchEvents();
    fetchClients();
    fetchProjects();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get("/api/client");
      setClients(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/project");
      console.log(response.data);

      setProjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const getEventsForDate = (date) => {
    const dateStr = formatDate(date);
    return events.filter((event) => event.date === dateStr);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewEvent({ ...newEvent, date: formatDate(date) });
    setShowEventModal(true);
  };

  const handleAddEvent = async () => {
    try {
      const eventData = {
        ...newEvent,
        color: eventTypes.find((t) => t.value === newEvent.type)?.color,
      };

      const response = await axios.post("/api/events", eventData);
      setEvents([...events, response.data]);
      resetModal();
      alert("Événement ajouté avec succès!");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout de l'événement");
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const response = await axios.put(
        `/api/events/${editingEvent._id}`,
        editingEvent
      );
      setEvents(
        events.map((e) => (e._id === editingEvent._id ? response.data : e))
      );
      resetModal();
      alert("Événement mis à jour!");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (confirm("Supprimer cet événement?")) {
      try {
        await axios.delete(`/api/events/${id}`);
        setEvents(events.filter((e) => e._id !== id));
        resetModal();
        alert("Événement supprimé!");
      } catch (error) {
        console.error(error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent(event);
    setShowEventModal(true);
  };

  const resetModal = () => {
    setShowEventModal(false);
    setEditingEvent(null);
    setNewEvent({
      title: "",
      date: "",
      time: "",
      type: "meeting",
      description: "",
      client_id: "",
      project_id: "",
    });
  };

  const monthYear = currentDate.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  // Get upcoming events
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendrier</h1>
            <p className="text-gray-600">Gérez vos rendez-vous et échéances</p>
          </div>
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setNewEvent({ ...newEvent, date: formatDate(new Date()) });
              setShowEventModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all hover:shadow-lg"
          >
            <Plus size={20} />
            Nouvel Événement
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {monthYear}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToToday}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Aujourd'hui
                  </button>
                  <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                {/* Week Days */}
                <div className="grid grid-cols-7 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-gray-600 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((dayInfo, index) => {
                    const dayEvents = getEventsForDate(dayInfo.date);
                    const isCurrentDay = isToday(dayInfo.date);

                    return (
                      <div
                        key={index}
                        onClick={() =>
                          dayInfo.isCurrentMonth &&
                          handleDateClick(dayInfo.date)
                        }
                        className={`
                          min-h-[100px] p-2 border rounded-lg cursor-pointer transition-all
                          ${
                            dayInfo.isCurrentMonth
                              ? "bg-white hover:bg-gray-50"
                              : "bg-gray-50"
                          }
                          ${
                            isCurrentDay
                              ? "border-blue-500 border-2"
                              : "border-gray-200"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`
                              text-sm font-semibold
                              ${!dayInfo.isCurrentMonth && "text-gray-400"}
                              ${isCurrentDay && "text-blue-600"}
                            `}
                          >
                            {dayInfo.day}
                          </span>
                          {dayEvents.length > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {dayEvents.length}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event._id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditEvent(event);
                              }}
                              className="text-xs p-1 rounded truncate"
                              style={{
                                backgroundColor: `${event.color}20`,
                                color: event.color,
                                borderLeft: `3px solid ${event.color}`,
                              }}
                            >
                              {event.time && (
                                <span className="font-semibold">
                                  {event.time}{" "}
                                </span>
                              )}
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500 pl-1">
                              +{dayEvents.length - 2} plus
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Types Legend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Types d'événements
              </h3>
              <div className="space-y-3">
                {eventTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.value} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: type.color }}
                      />
                      <Icon size={16} style={{ color: type.color }} />
                      <span className="text-sm text-gray-700">
                        {type.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Événements à venir
              </h3>
              <div className="space-y-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => {
                    const Icon = eventTypes.find(
                      (t) => t.value === event.type
                    )?.icon;
                    return (
                      <div
                        key={event._id}
                        onClick={() => handleEditEvent(event)}
                        className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {Icon && (
                            <Icon
                              size={16}
                              style={{ color: event.color }}
                              className="mt-0.5"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {event.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(event.date).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "short",
                                }
                              )}
                              {event.time && ` - ${event.time}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Aucun événement à venir
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingEvent ? "Modifier l'événement" : "Nouvel événement"}
                </h2>
                <button
                  onClick={resetModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={editingEvent ? editingEvent.title : newEvent.title}
                    onChange={(e) =>
                      editingEvent
                        ? setEditingEvent({
                            ...editingEvent,
                            title: e.target.value,
                          })
                        : setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Réunion client"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={editingEvent ? editingEvent.date : newEvent.date}
                      onChange={(e) =>
                        editingEvent
                          ? setEditingEvent({
                              ...editingEvent,
                              date: e.target.value,
                            })
                          : setNewEvent({ ...newEvent, date: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure
                    </label>
                    <input
                      type="time"
                      value={editingEvent ? editingEvent.time : newEvent.time}
                      onChange={(e) =>
                        editingEvent
                          ? setEditingEvent({
                              ...editingEvent,
                              time: e.target.value,
                            })
                          : setNewEvent({ ...newEvent, time: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={editingEvent ? editingEvent.type : newEvent.type}
                    onChange={(e) =>
                      editingEvent
                        ? setEditingEvent({
                            ...editingEvent,
                            type: e.target.value,
                          })
                        : setNewEvent({ ...newEvent, type: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {eventTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={
                      editingEvent
                        ? editingEvent.description
                        : newEvent.description
                    }
                    onChange={(e) =>
                      editingEvent
                        ? setEditingEvent({
                            ...editingEvent,
                            description: e.target.value,
                          })
                        : setNewEvent({
                            ...newEvent,
                            description: e.target.value,
                          })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Détails de l'événement..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client
                    </label>
                    <select
                      value={
                        editingEvent
                          ? editingEvent.client_id
                          : newEvent.client_id
                      }
                      onChange={(e) =>
                        editingEvent
                          ? setEditingEvent({
                              ...editingEvent,
                              client_id: e.target.value,
                            })
                          : setNewEvent({
                              ...newEvent,
                              client_id: e.target.value,
                            })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Sélectionner --</option>
                      {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                          {client.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Projet
                    </label>
                    <select
                      value={
                        editingEvent
                          ? editingEvent.project_id
                          : newEvent.project_id
                      }
                      onChange={(e) =>
                        editingEvent
                          ? setEditingEvent({
                              ...editingEvent,
                              project_id: e.target.value,
                            })
                          : setNewEvent({
                              ...newEvent,
                              project_id: e.target.value,
                            })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Sélectionner --</option>
                      {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                {editingEvent && (
                  <button
                    onClick={() => handleDeleteEvent(editingEvent._id)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                    Supprimer
                  </button>
                )}
                <div className="flex gap-3 ml-auto">
                  <button
                    onClick={resetModal}
                    className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editingEvent ? "Mettre à jour" : "Créer"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
