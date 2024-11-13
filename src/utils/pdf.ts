import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { Event } from '../types';

export type PDFTemplate = 'modern' | 'minimal' | 'elegant';

interface PDFOptions {
  template: PDFTemplate;
  includeDescription: boolean;
  includePresentationNotes: boolean;
}

const TEMPLATES = {
  modern: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#8b5cf6',
    background: '#f8fafc',
    text: '#1f2937',
  },
  minimal: {
    primary: '#000000',
    secondary: '#4b5563',
    accent: '#9ca3af',
    background: '#ffffff',
    text: '#111827',
  },
  elegant: {
    primary: '#7c3aed',
    secondary: '#4c1d95',
    accent: '#2563eb',
    background: '#f3f4f6',
    text: '#1f2937',
  },
};

export const generatePDF = (
  events: Event[],
  startDate: Date,
  endDate: Date,
  options: PDFOptions
) => {
  const doc = new jsPDF();
  const template = TEMPLATES[options.template];
  
  // Add custom font
  doc.setFont('helvetica', 'bold');
  
  // Cover Page
  createCoverPage(doc, startDate, endDate, template);
  
  // Table of Contents
  doc.addPage();
  createTableOfContents(doc, events, template);
  
  // Events Pages
  const filteredEvents = events.filter(event => 
    event.date >= startDate && event.date <= endDate
  );
  
  // Group events by month
  const eventsByMonth = groupEventsByMonth(filteredEvents);
  
  Object.entries(eventsByMonth).forEach(([month, monthEvents]) => {
    doc.addPage();
    createMonthPage(doc, month, monthEvents, template, options);
  });
  
  // Presentation Notes
  if (options.includePresentationNotes) {
    doc.addPage();
    createPresentationNotes(doc, startDate, endDate, template);
  }
  
  // Add page numbers
  addPageNumbers(doc, template);
  
  // Save the PDF
  const fileName = `calendar-events-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};

function createCoverPage(doc: jsPDF, startDate: Date, endDate: Date, template: any) {
  // Background
  doc.setFillColor(template.background);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
  // Header Design
  doc.setFillColor(template.primary);
  doc.rect(0, 0, doc.internal.pageSize.width, 60, 'F');
  
  // Title
  doc.setTextColor('#ffffff');
  doc.setFontSize(32);
  doc.text('Calendar Events', 20, 40);
  
  // Date Range
  doc.setFontSize(16);
  doc.text(
    `${format(startDate, 'MMMM d, yyyy')} - ${format(endDate, 'MMMM d, yyyy')}`,
    20,
    55
  );
  
  // Decorative Elements
  doc.setFillColor(template.accent);
  doc.circle(doc.internal.pageSize.width - 40, 100, 20, 'F');
  doc.setFillColor(template.secondary);
  doc.circle(30, doc.internal.pageSize.height - 40, 15, 'F');
  
  // Footer
  doc.setTextColor(template.text);
  doc.setFontSize(10);
  doc.text(
    `Generated on ${format(new Date(), 'MMMM d, yyyy')}`,
    20,
    doc.internal.pageSize.height - 20
  );
}

function createTableOfContents(doc: jsPDF, events: Event[], template: any) {
  doc.setTextColor(template.text);
  doc.setFontSize(24);
  doc.text('Table of Contents', 20, 30);
  
  doc.setFontSize(12);
  let y = 50;
  
  const sections = [
    { title: 'Overview', page: 1 },
    { title: 'Monthly Events', page: 2 },
    { title: 'Presentation Notes', page: doc.internal.getNumberOfPages() }
  ];
  
  sections.forEach(section => {
    doc.text(section.title, 20, y);
    doc.text(section.page.toString(), 180, y);
    
    // Add dots between title and page number
    const dots = '.'.repeat(50);
    const dotsWidth = doc.getTextWidth(dots);
    doc.text(
      dots,
      100 - dotsWidth / 2,
      y,
      { align: 'center' }
    );
    
    y += 15;
  });
}

function createMonthPage(
  doc: jsPDF,
  month: string,
  events: Event[],
  template: any,
  options: PDFOptions
) {
  // Month Header
  doc.setFillColor(template.primary);
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
  
  doc.setTextColor('#ffffff');
  doc.setFontSize(24);
  doc.text(month, 20, 28);
  
  let y = 50;
  
  events.forEach(event => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    // Event Date
    doc.setTextColor(template.primary);
    doc.setFontSize(14);
    doc.text(
      format(event.date, 'EEEE, MMMM d'),
      20,
      y
    );
    
    // Event Title
    doc.setTextColor(template.text);
    doc.setFontSize(12);
    doc.text(event.title, 20, y + 7);
    
    // Event Description
    if (options.includeDescription && event.description) {
      doc.setTextColor(template.secondary);
      doc.setFontSize(10);
      const description = doc.splitTextToSize(event.description, 170);
      doc.text(description, 20, y + 15);
      y += (description.length * 5);
    }
    
    y += 25;
  });
}

function createPresentationNotes(doc: jsPDF, startDate: Date, endDate: Date, template: any) {
  doc.setTextColor(template.text);
  doc.setFontSize(24);
  doc.text('Presentation Notes', 20, 30);
  
  doc.setFontSize(12);
  const notes = [
    `This calendar overview presents our scheduled events and holidays from ${format(startDate, 'MMMM d, yyyy')} to ${format(endDate, 'MMMM d, yyyy')}.`,
    '',
    'Key Points for Presentation:',
    '• Review the events chronologically',
    '• Highlight important dates and deadlines',
    '• Note any overlapping events or busy periods',
    '• Consider time zones for international events',
    '',
    'Suggestions for Discussion:',
    '• Start with an overview of the entire period',
    '• Focus on major events and their significance',
    '• Address any scheduling conflicts',
    '• Allow time for questions and clarifications'
  ];
  
  let y = 50;
  notes.forEach(note => {
    const lines = doc.splitTextToSize(note, 170);
    doc.text(lines, 20, y);
    y += 10 * lines.length;
  });
}

function addPageNumbers(doc: jsPDF, template: any) {
  const pageCount = doc.internal.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(template.secondary);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
}

function groupEventsByMonth(events: Event[]) {
  return events.reduce((acc: { [key: string]: Event[] }, event) => {
    const month = format(event.date, 'MMMM yyyy');
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(event);
    return acc;
  }, {});
}