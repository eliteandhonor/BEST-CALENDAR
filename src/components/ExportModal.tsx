import React, { useState } from 'react';
import { X, Download, Presentation, Check } from 'lucide-react';
import { Event } from '../types';

interface ExportModalProps {
  events: Event[];
  onClose: () => void;
  currentDate: Date;
  initialView: 'pdf' | 'presentation';
  onStartPresentation: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  events,
  onClose,
  currentDate,
  initialView,
  onStartPresentation
}) => {
  const [exportType, setExportType] = useState<'pdf' | 'presentation'>(initialView);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([currentDate.getMonth()]);
  const [template, setTemplate] = useState<'modern' | 'minimal' | 'elegant'>('modern');

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
    if (exportType === 'presentation') {
      onStartPresentation();
    } else {
      // Handle PDF export
      console.log('Exporting PDF with options:', {
        months: selectedMonths,
        template,
        events: events.filter(event => 
          selectedMonths.includes(new Date(event.date).getMonth())
        )
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50">
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
              <h3 className="text-lg font-semibold text-white mb-2">Presentation Mode</h3>
              <p className="text-sm text-gray-400">Present your calendar in an interactive slideshow</p>
            </button>
          </div>

          {/* Month Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Select Months</h3>
            <div className="grid grid-cols-4 gap-3">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => handleMonthToggle(index)}
                  className={`
                    relative p-4 rounded-lg text-left transition-all duration-200
                    ${selectedMonths.includes(index)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
                  `}
                >
                  {selectedMonths.includes(index) && (
                    <Check className="absolute top-2 right-2 w-4 h-4" />
                  )}
                  <span className="block font-medium">{month}</span>
                  <span className="text-xs opacity-75">
                    {events.filter(e => new Date(e.date).getMonth() === index).length} events
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Template Selection */}
          {exportType === 'pdf' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Choose Template</h3>
              <div className="grid grid-cols-3 gap-4">
                {(['modern', 'minimal', 'elegant'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setTemplate(style)}
                    className={`
                      relative p-4 rounded-lg transition-all duration-200
                      ${template === style
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
                    `}
                  >
                    {template === style && (
                      <Check className="absolute top-2 right-2 w-4 h-4" />
                    )}
                    <div className="capitalize font-medium">{style}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {style === 'modern' && 'Clean & Professional'}
                      {style === 'minimal' && 'Simple & Elegant'}
                      {style === 'elegant' && 'Rich & Detailed'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700/50 flex justify-end gap-3">
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
                <Presentation className="w-4 h-4" />
                Start Presentation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};