'use client'

import { useState, useEffect } from 'react'

export default function FloatingSocial() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  // Реальные контакты RUBOLKA
  const telegramLink = "https://t.me/Rubolka"
  const whatsappLink = "https://wa.me/79375606402"

  return (
    <>
      {/* Стили для иконок */}
      <style jsx>{`
        .floating-social {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 15px;
          transition: all 0.3s ease;
        }

        .social-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          font-size: 24px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .social-icon::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          border-radius: 50%;
          transform: scale(0);
          transition: transform 0.3s ease;
          z-index: -1;
        }

        .social-icon:hover::before {
          transform: scale(1.1);
        }

        .social-icon:hover {
          transform: translateY(-5px) scale(1.1);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }

        .telegram {
          background: linear-gradient(135deg, #0088cc, #005fa3);
        }

        .telegram:hover {
          background: linear-gradient(135deg, #0099dd, #0066b4);
        }

        .whatsapp {
          background: linear-gradient(135deg, #25d366, #128c7e);
        }

        .whatsapp:hover {
          background: linear-gradient(135deg, #2ee477, #15a085);
        }

        .icon-tooltip {
          position: absolute;
          right: 70px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .icon-tooltip::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 100%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-left-color: rgba(0, 0, 0, 0.8);
        }

        .social-icon:hover .icon-tooltip {
          opacity: 1;
          visibility: visible;
          right: 75px;
        }

        .pulse-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(249, 229, 71, 0.7);
          }
          70% {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 15px rgba(249, 229, 71, 0);
          }
          100% {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(249, 229, 71, 0);
          }
        }

        @media (max-width: 768px) {
          .floating-social {
            bottom: 20px;
            right: 20px;
            gap: 12px;
          }

          .social-icon {
            width: 55px;
            height: 55px;
            font-size: 22px;
          }

          .icon-tooltip {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .floating-social {
            bottom: 15px;
            right: 15px;
            gap: 10px;
          }

          .social-icon {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }
        }
      `}</style>

      <div className={`floating-social ${isVisible ? 'opacity-100' : 'opacity-100'}`}>
        {/* Telegram */}
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon telegram pulse-animation"
          aria-label="Написать в Telegram"
        >
          <div className="icon-tooltip">Написать в Telegram</div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon whatsapp"
          aria-label="Написать в WhatsApp"
        >
          <div className="icon-tooltip">Написать в WhatsApp</div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
          </svg>
        </a>
      </div>
    </>
  )
} 