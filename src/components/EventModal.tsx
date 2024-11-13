import React, { useState } from 'react';
import { X, Clock, Tag, Globe, Pencil, Trash2 } from 'lucide-react';
import type { Event } from '../types';
import { EventForm } from './EventForm';

interface EventModalProps {
  event: Event;
  onClose: () => void;
  countryName: string;
  countries: { code: string; name: string }[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const EventModal: React.FC<EventModalProps> = ({
  event,
  onClose,
  countryName,
  countries,
  onEdit,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = (updatedEvent: Omit<Event, 'id'>) => {
    onEdit({ ...updatedEvent, id: event.id });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(event.id);
    onClose();
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full">
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">Edit Event</h3>
            <EventForm
              countries={countries}
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
              initialEvent={event}
              mode="edit"
            />
          </div>
        </div>
      </div>
    );
  }

  const renderRichContent = (content: Event['richContent']) => {
    if (!content?.length) return null;

    return content.map((item, index) => {
      switch (item.type) {
        case 'image':
          return (
            <img
              key={index}
              src={item.content}
              alt={item.title || 'Event image'}
              className="rounded-lg max-h-96 object-cover"
            />
          );
        case 'link':
          return (
            <a
              key={index}
              href={item.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {item.title || item.content}
            </a>
          );
        default:
          return null;
      }
    });
  };

  const timeDisplay = event.startTime && event.endTime
    ? `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
    : 'All Day';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: event.color }}
            />
            <h3 className="text-xl font-bold text-white">{event.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {event.description && (
            <p className="text-gray-300">{event.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              {timeDisplay}
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Globe className="w-4 h-4" />
              {countryName}
            </div>
          </div>

          {event.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </div>
              ))}
            </div>
          )}

          {event.richContent?.length > 0 && (
            <div className="space-y-4">
              {renderRichContent(event.richContent)}
            </div>
          )}
        </div>

        {showDeleteConfirm && (
          <div className="p-6 border-t border-gray-800">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-2">Delete Event?</h4>
              <p className="text-gray-400 mb-4">This action cannot be undone.</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {!showDeleteConfirm && (
          <div className="p-6 border-t border-gray-800">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};