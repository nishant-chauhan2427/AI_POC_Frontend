import React, { useState, useEffect } from 'react';
import { getJSON } from "../utils/api";

export default function CandidateListingData() {
  const [currentPage, setCurrentPage] = useState(1);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ type: null, url: null, title: '' });
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchCandidates() {
      try {
        setLoading(true);
        const data = await getJSON('/datalisting/interviews');
        
        const transformedData = data.map((item) => ({
          candidate_id: item.candidate_info?.candidate_id || 'N/A',
          candidate_name: item.candidate_info?.name || 'N/A',
          candidate_email: item.candidate_info?.email || 'N/A',
          jd_id: item.candidate_info?.test_id || 'N/A',
          aadhar_url: item.urls?.aadhaar?.[0] || '',
          photo_url: item.urls?.photo?.[0] || '',
          video_url: item.urls?.recording?.[0] || '',
          candidate_interview_pdf: item.urls?.interview_pdf || 'N/A',
          result: item.candidate_results?.result || 'Pending',
          percentage: item.candidate_results?.percentage || 0,
          completed_at: item.candidate_results?.completed_at?.split('T')[0] || 'N/A'
        }));
        
        setCandidates(transformedData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching candidates:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCandidates();
  }, []);

  const totalPages = Math.ceil(candidates.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedCandidates = candidates.slice(startIdx, startIdx + itemsPerPage);

  const styles = {
    page: {
      minHeight: '100vh',
      width: '100vw',
      padding: 2,
      background: 'radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.18), transparent), radial-gradient(1200px 600px at 90% 20%, rgba(168,85,247,0.15), transparent), radial-gradient(1200px 600px at 10% 90%, rgba(59,130,246,0.12), transparent), #0b1020',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflowX: 'hidden',
      overflowY:'hidden',
    },
    btn: {
      padding: '8px 16px',
      fontWeight: 700,
      color: '#fff',
      background: '#ef4444',
      border: 'none',
      borderRadius: 10,
      cursor: 'pointer',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    },
    tableContainer: {
      maxWidth: 1400,
      margin: '0 auto',
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: 16,
      boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
      overflow: 'hidden'
    },
    headerBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    },
    headerTitle: {
      margin: 0,
      fontSize: 24,
      fontWeight: 600
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    thead: {
      background: '#1a1f3a',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    },
    th: {
      padding: '12px 12px',
      textAlign: 'left',
      fontWeight: 700,
      fontSize: 14,
      color: '#fff',
      borderRight: '1px solid rgba(255,255,255,0.05)'
    },
    td: {
      padding: '14px 12px',
      fontSize: 14,
      color: 'rgba(255,255,255,0.9)',
      borderRight: '1px solid rgba(255,255,255,0.05)'
    },
    button: {
      padding: '8px 12px',
      borderRadius: 8,
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: 12,
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'rgba(59,130,246,0.2)',
      borderLeft: '2px solid #3b82f6'
    },
    badgePass: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      background: 'rgba(34,197,94,0.2)',
      color: '#86efac',
      border: '1px solid rgba(34,197,94,0.4)'
    },
    badgePending: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      background: 'rgba(234,179,8,0.2)',
      color: '#fcd34d',
      border: '1px solid rgba(234,179,8,0.4)'
    },
    badgeFail: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      background: 'rgba(239,68,68,0.2)',
      color: '#fca5a5',
      border: '1px solid rgba(239,68,68,0.4)'
    },
    progressContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    },
    progressBar: {
      width: 80,
      height: 6,
      background: 'rgba(0,0,0,0.3)',
      borderRadius: 10,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
      borderRadius: 10
    },
    percentText: {
      fontSize: 12,
      fontWeight: 700,
      minWidth: 40
    },
    footer: {
      padding: '16px 20px',
      background: 'rgba(0,0,0,0.2)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    paginationInfo: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.75)',
      margin: 0
    },
    paginationContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    },
    paginationButton: {
      padding: '8px 14px',
      borderRadius: 8,
      border: '1px solid rgba(255,255,255,0.2)',
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: 13,
      transition: 'all 0.2s'
    },
    paginationButtonDisabled: {
      opacity: 0.4,
      cursor: 'not-allowed'
    },
    pageButton: {
      padding: '8px 12px',
      borderRadius: 8,
      border: '1px solid rgba(255,255,255,0.2)',
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: 12,
      transition: 'all 0.2s'
    },
    pageButtonActive: {
      background: '#6366f1',
      border: '1px solid #8b5cf6'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      fontSize: 16
    },
    errorContainer: {
      padding: '20px',
      background: 'rgba(239,68,68,0.2)',
      borderRadius: 8,
      color: '#fca5a5',
      marginBottom: 20
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    },
    modalContent: {
      background: 'rgba(20,24,48,0.95)',
      borderRadius: 16,
      padding: '30px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'auto',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      position: 'relative'
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'rgba(239,68,68,0.3)',
      border: 'none',
      color: '#fff',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      fontWeight: 'bold'
    },
    modalTitle: {
      marginTop: 0,
      marginBottom: '20px',
      fontSize: '20px',
      fontWeight: 600,
      color: '#fff'
    },
    modalImage: {
      width: '100%',
      maxWidth: '600px',
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.1)'
    },
    modalVideo: {
      width: '100%',
      maxWidth: '800px',
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.1)'
    },
    modalPdf: {
        width: '100%',
        maxWidth: '800px',
        height: '70vh',
        borderRadius: 12,
        overflowY:'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#000'
      },
      fullImage: {
        width: '80%',
        height: '80%',
        overflowY:'hidden',
        objectFit: 'contain',  // full image visible
        borderRadius: 12,
      }
            
      
  };

  const handleOpenModal = (type, url, title) => {
    setModalContent({ type, url, title });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalContent({ type: null, url: null, title: '' });
  };

  const handlePreview = (type, url, title) => {
    if (url) handleOpenModal(type, url, title);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getResultBadge = (result) => {
    const normalizedResult = result?.toLowerCase() || '';
    if (normalizedResult === 'pass' || normalizedResult === 'selected') return styles.badgePass;
    if (normalizedResult === 'fail' || normalizedResult === 'rejected') return styles.badgeFail;
    return styles.badgePending;
  };

  function clearRegistration() {
    if (window.confirm("Are you sure you want to end the session?")) {
      window.location.href = "/";
    }
  }

  const renderModalContent = () => {
    switch (modalContent.type) {
      case 'image':
        return (
          <>
          {/* <h1>Hello</h1> */}
            <h2 style={styles.modalTitle}>{modalContent.title}</h2>
            <img src={modalContent.url} alt={modalContent.title} style={styles.modalImage} />
          </>
        );
      case 'video':
        return (
          <>
          {/* <h1>video</h1> */}
            <h2 style={styles.modalTitle}>{modalContent.title}</h2>
            <video 
              src={modalContent.url} 
              controls 
              style={styles.modalVideo}
              autoPlay
            />
          </>
        );
      case 'pdf':
        return (
          <>
          {/* <h1>pdf</h1> */}
            <h2 style={styles.modalTitle}>{modalContent.title}</h2>
            <div style={styles.modalPdf}>
  <img 
    src={modalContent.url}
    alt={modalContent.title}
    style={styles.fullImage}
  />
</div>



          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.page}>
      <img 
        src="/PRAGYAN.AI-logo-dark.svg" 
        width={280} 
        alt="PRAGYAN.AI Logo"
      />

      <div style={styles.tableContainer}>
        <div style={styles.headerBar}>
          <h1 style={styles.headerTitle}>Candidate Data</h1>
          <button 
            onClick={clearRegistration}
            style={styles.btn}
          >
            Log Out
          </button>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div style={styles.loadingContainer}>
            Loading candidates...
          </div>
        ) : candidates.length === 0 ? (
          <div style={styles.loadingContainer}>
            No candidates found
          </div>
        ) : (
          <>
            <table style={styles.table}>
              <thead style={{background: '#1a1f3a', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                <tr>
                  <th style={styles.th}>Candidate ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Test ID</th>
                  <th style={styles.th}>Aadhaar Card</th>
                  <th style={styles.th}>Photo</th>
                  <th style={styles.th}>Interview Video</th>
                  <th style={styles.th}>Percentage</th>
                  <th style={styles.th}>Completed At</th>
                  <th style={styles.th}>Result</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCandidates.map((candidate, idx) => (
                  <tr 
                    key={idx} 
                    style={{...styles.tr, borderBottom: '1px solid rgba(255,255,255,0.05)'}}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} 
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={styles.td}>{candidate.candidate_id}</td>
                    <td style={styles.td}>{candidate.candidate_name}</td>
                    <td style={styles.td}>{candidate.candidate_email}</td>
                    <td style={styles.td}>{candidate.jd_id}</td>
                    
                    <td style={styles.td}>
                      <button
                        onClick={() => handlePreview('pdf', candidate.aadhar_url, `${candidate.candidate_name} - Aadhaar Card`)}
                        style={{...styles.button, opacity: candidate.aadhar_url ? 1 : 0.5, cursor: candidate.aadhar_url ? 'pointer' : 'not-allowed'}}
                        disabled={!candidate.aadhar_url}
                        onMouseEnter={(e) => candidate.aadhar_url && (e.currentTarget.style.background = 'rgba(59,130,246,0.35)')}
                        onMouseLeave={(e) => candidate.aadhar_url && (e.currentTarget.style.background = 'rgba(59,130,246,0.2)')}
                      >
                        👁️ View
                      </button>
                    </td>

                    <td style={styles.td}>
                      <button
                        onClick={() => handlePreview('image', candidate.photo_url, `${candidate.candidate_name} - Photo`)}
                        style={{...styles.button, opacity: candidate.photo_url ? 1 : 0.5, cursor: candidate.photo_url ? 'pointer' : 'not-allowed'}}
                        disabled={!candidate.photo_url}
                        onMouseEnter={(e) => candidate.photo_url && (e.currentTarget.style.background = 'rgba(168,85,247,0.35)')}
                        onMouseLeave={(e) => candidate.photo_url && (e.currentTarget.style.background = 'rgba(168,85,247,0.2)')}
                      >
                        👁️ View
                      </button>
                    </td>

                    <td style={styles.td}>
                      <button
                        onClick={() => handlePreview('video', candidate.video_url, `${candidate.candidate_name} - Interview`)}
                        style={{...styles.button, opacity: candidate.video_url ? 1 : 0.5, cursor: candidate.video_url ? 'pointer' : 'not-allowed'}}
                        disabled={!candidate.video_url}
                        onMouseEnter={(e) => candidate.video_url && (e.currentTarget.style.background = 'rgba(99,102,241,0.5)')}
                        onMouseLeave={(e) => candidate.video_url && (e.currentTarget.style.background = 'rgba(99,102,241,0.3)')}
                      >
                        ▶️ Play
                      </button>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.progressContainer}>
                        <div style={styles.progressBar}>
                          <div style={{...styles.progressFill, width: `${candidate.percentage}%`}}></div>
                        </div>
                        <span style={styles.percentText}>{candidate.percentage}%</span>
                      </div>
                    </td>

                    <td style={styles.td}>{candidate.completed_at}</td>

                    <td style={styles.td}>
                      <span style={getResultBadge(candidate.result)}>
                        {candidate.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.footer}>
              <p style={styles.paginationInfo}>
                Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, candidates.length)} of {candidates.length} candidates
              </p>

              <div style={styles.paginationContainer}>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  style={{...styles.paginationButton, ...(currentPage === 1 ? styles.paginationButtonDisabled : {})}}
                >
                  ← Previous
                </button>

                <div style={{display: 'flex', gap: 6}}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{...styles.pageButton, ...(currentPage === page ? styles.pageButtonActive : {})}}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  style={{...styles.paginationButton, ...(currentPage === totalPages ? styles.paginationButtonDisabled : {})}}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Popup */}
      {modalOpen && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={handleCloseModal}
              style={styles.closeButton}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
            >
              ✕
            </button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}