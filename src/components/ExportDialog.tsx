import React, { useState } from 'react';
import { Calendar, Download, Presentation, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { generatePDF, generateHTML } from '../services/export';
import type { Event } from '../types';

interface ExportDialogProps {
  events: Event[];
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  events,
  onClose,
}) => {
  const [exportType, setExportType] = useState<'pdf' | 'presentation'>('pdf');
  const [selectedMonths, setSelectedMonths] = useState<number[]>([new Date().getMonth()]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleMonthToggle = (monthIndex: number) => {
    setSelectedMonths(prev => 
      prev.includes(monthIndex)
        ? prev.filter(m => m !== monthIndex)
        : [...prev, monthIndex]
    );
  };

  const handleExport = () => {
    const filteredEvents = events.filter(event => 
      selectedMonths.includes(new Date(event.date).getMonth())
    );

    if (filteredEvents.length === 0) {
      alert('Please select at least one month with events to export.');
      return;
    }

    const startDate = new Date(Math.min(...filteredEvents.map(e => new Date(e.date).getTime())));
    const endDate = new Date(Math.max(...filteredEvents.map(e => new Date(e.date).getTime())));

    if (exportType === 'pdf') {
      generatePDF(filteredEvents, startDate, endDate);
    } else {
      generateHTML(filteredEvents, startDate, endDate);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 w-full max-w-4xl rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Export Calendar</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Export Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setExportType('pdf')}
              className={`
                p-6 rounded-xl border-2 transition-all duration-200
                ${exportType === 'pdf'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 hover:border-gray-600'}
              `}
            >
              <Download className={`w-8 h-8 mb-3 ${exportType === 'pdf' ? 'text-blue-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-semibold text-white mb-2">PDF Export</h3>
              <p className="text-sm text-gray-400">Download a beautifully formatted PDF document</p>
            </button>

            <button
              onClick={() => setExportType('presentation')}
              className={`
                p-6 rounded-xl border-2 transition-all duration-200
                ${exportType === 'presentation'
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 hover:border-gray-600'}
              `}
            >
              <Presentation className={`w-8 h-8 mb-3 ${exportType === 'presentation' ? 'text-purple-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-semibold text-white mb-2">HTML Presentation</h3>
              <p className="text-sm text-gray-400">Export as an interactive HTML presentation</p>
            </button>
          </div>

          {/* Month Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Select Months</h3>
            <div className="grid grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {months.map((month, index) => {
                const monthEvents = events.filter(e => new Date(e.date).getMonth() === index);
                return (
                  <button
                    key={month}
                    onClick={() => handleMonthToggle(index)}
                    className={`
                      relative p-4 rounded-lg text-left transition-all duration-200
                      ${selectedMonths.includes(index)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
                      ${monthEvents.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    disabled={monthEvents.length === 0}
                  >
                    {selectedMonths.includes(index) && (
                      <Check className="absolute top-2 right-2 w-4 h-4" />
                    )}
                    <Calendar className="w-5 h-5 mb-2 opacity-75" />
                    <span className="block font-medium">{month}</span>
                    <span className="text-xs opacity-75">
                      {monthEvents.length} events
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className={`
              px-6 py-2 rounded-lg text-white flex items-center gap-2 transition-colors
              ${exportType === 'pdf'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-purple-500 hover:bg-purple-600'}
            `}
          >
            {exportType === 'pdf' ? (
              <>
                <Download className="w-4 h-4" />
                Export PDF
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export HTML
              </>
            )}
          </button>
        </div>
      </div>

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
    </div>
  );
};