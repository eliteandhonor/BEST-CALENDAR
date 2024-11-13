import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Event } from '../types';

interface PresentationViewProps {
  events: Event[];
  startDate: Date;
  endDate: Date;
  onClose: () => void;
}

export const PresentationView: React.FC<PresentationViewProps> = ({
  events,
  startDate,
  endDate,
  onClose,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Group events by month
  const eventsByMonth = events.reduce((acc: { [key: string]: Event[] }, event) => {
    const monthKey = format(new Date(event.date), 'MMMM yyyy');
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(event);
    return acc;
  }, {});

  const slides = [
    {
      id: 'overview',
      content: (
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Calendar Events
          </h1>
          <p className="text-2xl text-gray-400">
            {format(startDate, 'MMMM d, yyyy')} - {format(endDate, 'MMMM d, yyyy')}
          </p>
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto mt-12">
            <div className="bg-gray-800/50 p-8 rounded-xl">
              <div className="text-5xl font-bold text-blue-500 mb-2">
                {Object.keys(eventsByMonth).length}
              </div>
              <div className="text-xl text-gray-400">Months</div>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-xl">
              <div className="text-5xl font-bold text-purple-500 mb-2">
                {events.length}
              </div>
              <div className="text-xl text-gray-400">Total Events</div>
            </div>
          </div>
        </div>
      ),
    },
    ...Object.entries(eventsByMonth).map(([month, monthEvents]) => ({
      id: month,
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {month}
          </h2>
          <div className="grid gap-4 max-w-4xl mx-auto">
            {monthEvents.map((event) => (
              <div
                key={`${event.id}-${month}`}
                className="bg-gray-800/50 p-6 rounded-xl transform transition-all duration-500"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: event.color }}
                      />
                      <h3 className="text-xl font-semibold text-white">
                        {event.title}
                      </h3>
                    </div>
                    <div className="text-blue-400 mb-2">
                      {format(new Date(event.date), 'EEEE, MMMM d')}
                    </div>
                    {event.description && (
                      <p className="text-gray-400">{event.description}</p>
                    )}
                    {event.richContent?.map((content, index) => (
                      <div key={index} className="mt-4">
                        {content.type === 'image' && (
                          <img
                            src={content.content}
                            alt={content.title || 'Event image'}
                            className="rounded-lg max-h-64 object-cover"
                          />
                        )}
                        {content.type === 'link' && (
                          <a
                            href={content.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            {content.title || content.content}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    })),
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen().catch(() => {
          // Ignore error if not in fullscreen
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [slides.length, isFullscreen]);

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      console.warn('Fullscreen request failed:', error);
      // Continue without fullscreen
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-950 text-white z-50">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={toggleFullscreen}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-6 h-6" />
          ) : (
            <Maximize2 className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="text-sm font-medium">
            <span className="text-blue-400">{currentSlide + 1}</span>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-400">{slides.length}</span>
          </div>
          
          <button
            onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="h-screen flex items-center justify-center p-12 overflow-y-auto">
        <div className="w-full max-w-6xl animate-fade-in">
          {slides[currentSlide].content}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};