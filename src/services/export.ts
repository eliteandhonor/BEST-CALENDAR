import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import type { Event } from '../types';

const colors = {
  background: [17, 24, 39],
  card: [31, 41, 55],
  primary: [59, 130, 246],
  text: {
    primary: [255, 255, 255],
    secondary: [156, 163, 175],
    muted: [107, 114, 128]
  }
};

export const generatePDF = async (events: Event[], startDate: Date, endDate: Date) => {
  const doc = new jsPDF();
  const margin = 20;
  let yOffset = margin;

  // Set background
  doc.setFillColor(...colors.background);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

  // Header
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, doc.internal.pageSize.width, 60, 'F');

  // Title
  doc.setTextColor(...colors.text.primary);
  doc.setFontSize(24);
  doc.text('Calendar Events', margin, 40);

  // Date Range
  doc.setFontSize(14);
  doc.text(
    `${format(startDate, 'MMMM d, yyyy')} - ${format(endDate, 'MMMM d, yyyy')}`,
    margin,
    55
  );

  yOffset = 80;

  // Events
  events.forEach(event => {
    if (yOffset > doc.internal.pageSize.height - 60) {
      doc.addPage();
      yOffset = margin;
      
      // Set background for new page
      doc.setFillColor(...colors.background);
      doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
    }

    // Event card background
    doc.setFillColor(...colors.card);
    const cardHeight = event.description ? 80 : 60;
    doc.roundedRect(margin, yOffset, doc.internal.pageSize.width - (margin * 2), cardHeight, 3, 3, 'F');

    // Event title
    doc.setTextColor(...colors.text.primary);
    doc.setFontSize(16);
    doc.text(event.title, margin + 10, yOffset + 20);

    // Event date and time
    doc.setTextColor(...colors.text.secondary);
    doc.setFontSize(12);
    const dateText = format(new Date(event.date), 'MMMM d, yyyy');
    const timeText = event.startTime && event.endTime ? 
      `${format(new Date(`2000-01-01T${event.startTime}`), 'h:mm a')} - ${format(new Date(`2000-01-01T${event.endTime}`), 'h:mm a')}` :
      'All Day';
    doc.text(`${dateText} • ${timeText}`, margin + 10, yOffset + 35);

    // Event description
    if (event.description) {
      doc.setTextColor(...colors.text.muted);
      doc.setFontSize(11);
      doc.text(event.description, margin + 10, yOffset + 50);
    }

    // Links
    if (event.richContent?.length) {
      const links = event.richContent.filter(content => content.type === 'link');
      if (links.length > 0) {
        let linkOffset = yOffset + (event.description ? 65 : 45);
        
        links.forEach(link => {
          const linkText = link.title || link.content;
          doc.setTextColor(...colors.primary);
          doc.setFontSize(11);
          doc.text('Link: ', margin + 10, linkOffset);
          
          const linkWidth = doc.getTextWidth(linkText);
          doc.link(margin + 30, linkOffset - 5, linkWidth, 10, { url: link.content });
          doc.text(linkText, margin + 30, linkOffset);
          
          linkOffset += 15;
        });
      }
    }

    yOffset += cardHeight + 10;
  });

  // Save the PDF
  doc.save(`calendar-events-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const generateHTML = (events: Event[], startDate: Date, endDate: Date): string => {
  const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Calendar Events Presentation</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          color-scheme: dark;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          background: rgb(17, 24, 39);
          color: white;
        }

        .slide {
          display: none;
          height: 100vh;
          padding: 2rem;
          box-sizing: border-box;
        }

        .slide.active {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .event-card {
          background: rgb(31, 41, 55);
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin: 1rem 0;
          max-width: 800px;
          width: 100%;
        }

        .event-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .event-date {
          color: #60a5fa;
          margin-bottom: 0.5rem;
        }

        .event-description {
          color: #9ca3af;
          margin-bottom: 1rem;
        }

        .event-link {
          color: #3b82f6;
          text-decoration: none;
        }

        .event-link:hover {
          text-decoration: underline;
        }

        .event-image {
          max-width: 100%;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .controls {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
          background: rgba(0, 0, 0, 0.5);
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
        }

        button:hover {
          background: #2563eb;
        }

        button:disabled {
          background: #4b5563;
          cursor: not-allowed;
        }
      </style>
    </head>
    <body>
      <div id="presentation">
        <div class="slide active">
          <h1 class="title">Calendar Events</h1>
          <p style="color: #9ca3af; font-size: 1.25rem;">
            ${format(startDate, 'MMMM d, yyyy')} - ${format(endDate, 'MMMM d, yyyy')}
          </p>
          <div class="event-card">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; text-align: center;">
              <div>
                <div style="font-size: 3rem; color: #3b82f6; font-weight: bold;">
                  ${events.length}
                </div>
                <div style="color: #9ca3af;">Total Events</div>
              </div>
              <div>
                <div style="font-size: 3rem; color: #8b5cf6; font-weight: bold;">
                  ${new Set(events.map(e => format(new Date(e.date), 'MMMM yyyy'))).size}
                </div>
                <div style="color: #9ca3af;">Months</div>
              </div>
            </div>
          </div>
        </div>

        ${events.map((event, index) => `
          <div class="slide">
            <div class="event-card">
              <div class="event-title">${event.title}</div>
              <div class="event-date">
                ${format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                ${event.startTime && event.endTime ? 
                  `• ${format(new Date(`2000-01-01T${event.startTime}`), 'h:mm a')} - 
                   ${format(new Date(`2000-01-01T${event.endTime}`), 'h:mm a')}` : 
                  '• All Day'
                }
              </div>
              ${event.description ? 
                `<div class="event-description">${event.description}</div>` : 
                ''
              }
              ${event.richContent?.map(content => {
                if (content.type === 'image') {
                  return `<img src="${content.content}" alt="${content.title || 'Event image'}" class="event-image">`;
                } else if (content.type === 'link') {
                  return `<a href="${content.content}" target="_blank" rel="noopener noreferrer" class="event-link">
                    ${content.title || content.content}
                  </a>`;
                }
                return '';
              }).join('') || ''}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="controls">
        <button id="prevBtn" disabled>Previous</button>
        <button id="nextBtn">Next</button>
      </div>

      <script>
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        function updateSlide() {
          slides.forEach(slide => slide.classList.remove('active'));
          slides[currentSlide].classList.add('active');
          
          prevBtn.disabled = currentSlide === 0;
          nextBtn.disabled = currentSlide === slides.length - 1;
        }

        prevBtn.addEventListener('click', () => {
          if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
          }
        });

        nextBtn.addEventListener('click', () => {
          if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateSlide();
          }
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft' && currentSlide > 0) {
            currentSlide--;
            updateSlide();
          } else if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
            currentSlide++;
            updateSlide();
          }
        });
      </script>
    </body>
    </html>
  `;

  // Create a Blob and download the HTML file
  const blob = new Blob([template], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `calendar-presentation-${format(new Date(), 'yyyy-MM-dd')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return template;
};