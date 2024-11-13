import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Filter, Download, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import type { Event } from '../types';
import { EventModal } from './EventModal';
import { EventForm } from './EventForm';
import { ExportDialog } from './ExportDialog';

interface CalendarProps {
  events: Event[];
  countries: { code: string; name: string }[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  events,
  countries,
  onAddEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const handleDayClick = (date: Date, dayEvents: Event[]) => {
    if (dayEvents.length === 1) {
      setSelectedEvent(dayEvents[0]);
    } else if (dayEvents.length > 1) {
      setSelectedDate(date);
    }
  };

  return (
    <>
      <div className="bg-gray-900 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <button 
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddEventForm(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>
              <button
                onClick={() => setShowExportDialog(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-7 mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-center text-gray-400 font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-start-${index}`} className="aspect-square" />
            ))}

            {daysInMonth.map(date => {
              const dayEvents = getEventsForDay(date);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isCurrentDay = isToday(date);
              const dateStr = format(date, 'yyyy-MM-dd');

              return (
                <div
                  key={dateStr}
                  onClick={() => dayEvents.length > 0 && handleDayClick(date, dayEvents)}
                  className={`
                    relative aspect-square p-2 rounded-lg
                    ${isCurrentMonth ? 'bg-gray-800' : 'bg-gray-800/50'}
                    ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}
                    ${dayEvents.length > 0 ? 'cursor-pointer hover:bg-gray-700' : ''}
                    transition-colors duration-200
                  `}
                >
                  <span className={`
                    text-sm font-medium
                    ${isCurrentMonth ? 'text-white' : 'text-gray-500'}
                  `}>
                    {format(date, 'd')}
                  </span>

                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-2 left-2 right-2 max-h-[calc(100%-2rem)] overflow-y-auto custom-scrollbar">
                      {dayEvents.map((event) => (
                        <div
                          key={`${dateStr}-${event.id}`}
                          className="mb-1 px-1.5 py-0.5 rounded text-xs truncate"
                          style={{ 
                            backgroundColor: `${event.color}33`,
                            color: event.color 
                          }}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
              <div key={`empty-end-${index}`} className="aspect-square" />
            ))}
          </div>
        </div>
      </div>

      {showAddEventForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Add Event</h3>
                <button
                  onClick={() => setShowAddEventForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <EventForm
                countries={countries}
                onSubmit={(eventData) => {
                  onAddEvent(eventData);
                  setShowAddEventForm(false);
                }}
                onCancel={() => setShowAddEventForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          countryName={countries.find(c => c.code === selectedEvent.country)?.name || 'Unknown'}
          countries={countries}
          onEdit={onEditEvent}
          onDelete={onDeleteEvent}
        />
      )}

      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="space-y-4">
                {getEventsForDay(selectedDate).map(event => (
                  <button
                    key={event.id}
                    onClick={() => {
                      setSelectedEvent(event);
                      setSelectedDate(null);
                    }}
                    className="w-full p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-3 h-3 rounded-full mt-1.5"
                        style={{ backgroundColor: event.color }}
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {event.title}
                        </h4>
                        {event.description && (
                          <p className="text-gray-400 mt-1">{event.description}</p>
                        )}
                        {event.startTime && event.endTime && (
                          <div className="text-sm text-gray-500 mt-2">
                            {format(new Date(`2000-01-01T${event.startTime}`), 'h:mm a')} - 
                            {format(new Date(`2000-01-01T${event.endTime}`), 'h:mm a')}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showExportDialog && (
        <ExportDialog
          events={events}
          onClose={() => setShowExportDialog(false)}
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
};