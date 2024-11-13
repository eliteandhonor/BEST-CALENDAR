import React, { useState } from 'react';
import { X, Plus, Link, Image } from 'lucide-react';
import { format } from 'date-fns';
import type { Event, RichContent } from '../types';

interface EventFormProps {
  countries: { code: string; name: string }[];
  onSubmit: (event: Omit<Event, 'id'>) => void;
  onCancel: () => void;
  initialEvent?: Event;
  mode?: 'create' | 'edit';
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const EventForm: React.FC<EventFormProps> = ({
  countries,
  onSubmit,
  onCancel,
  initialEvent,
  mode = 'create'
}) => {
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [date, setDate] = useState(initialEvent ? format(new Date(initialEvent.date), 'yyyy-MM-dd') : '');
  const [startTime, setStartTime] = useState(initialEvent?.startTime || '');
  const [endTime, setEndTime] = useState(initialEvent?.endTime || '');
  const [country, setCountry] = useState(initialEvent?.country || '');
  const [category, setCategory] = useState<Event['category']>(initialEvent?.category || 'personal');
  const [tags, setTags] = useState<string[]>(initialEvent?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [richContent, setRichContent] = useState<RichContent[]>(initialEvent?.richContent || []);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [showLinkForm, setShowLinkForm] = useState(false);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;

    const newContent: RichContent = {
      type: 'image',
      content: imageUrl.trim()
    };

    setRichContent([...richContent, newContent]);
    setImageUrl('');
  };

  const handleAddLink = () => {
    if (!linkUrl.trim()) return;

    const newContent: RichContent = {
      type: 'link',
      content: linkUrl.trim(),
      title: linkTitle.trim() || linkUrl.trim()
    };

    setRichContent([...richContent, newContent]);
    setLinkUrl('');
    setLinkTitle('');
    setShowLinkForm(false);
  };

  const handleRemoveRichContent = (index: number) => {
    setRichContent(richContent.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const eventData: Omit<Event, 'id'> = {
      title,
      description,
      date: new Date(date),
      startTime,
      endTime,
      country,
      category,
      tags,
      richContent,
      color: initialEvent?.color || '#3B82F6'
    };

    onSubmit(eventData);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto pr-4" style={{ scrollbarWidth: 'thin' }}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Event['category'])}
            required
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="personal">Personal</option>
            <option value="business">Business</option>
            <option value="holiday">Holiday</option>
            <option value="cultural">Cultural</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-800 rounded-full text-sm text-gray-300 flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-500 hover:text-gray-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add tags..."
              className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setShowLinkForm(true)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <Link className="w-4 h-4" />
            Add Link
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('imageInput')?.focus()}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <Image className="w-4 h-4" />
            Add Image
          </button>
        </div>

        {showLinkForm && (
          <div className="space-y-4 p-4 bg-gray-800 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                URL
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title (optional)
              </label>
              <input
                type="text"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="Link title"
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLinkForm(false)}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddLink}
                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Link
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {richContent.map((content, index) => (
            <div key={index} className="group relative">
              {content.type === 'image' ? (
                <>
                  <img
                    src={content.content}
                    alt="Event"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </>
              ) : (
                <div className="p-4 bg-gray-800 rounded-lg flex items-center gap-3">
                  <Link className="w-4 h-4 text-blue-400" />
                  <a
                    href={content.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex-1 truncate"
                  >
                    {content.title || content.content}
                  </a>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemoveRichContent(index)}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              id="imageInput"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddImage();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {mode === 'create' ? 'Add Event' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};