import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert
} from 'react-native';
import axios from 'axios';

const INITIAL_BOOKS = [
  {
    id: 'b1',
    title: 'Concepts of Modern Physics',
    author: 'Arthur Beiser',
    category: 'Science',
    isbn: '978-0072448481',
    shelf: 'Rack S-04',
    rating: '4.8',
    status: 'AVAILABLE',
    isEbook: true,
    coverColor: '#0284C7',
    coverIcon: '⚛️',
    summary: 'A comprehensive study of quantum mechanics, relativity, atomic structure, and particle physics.',
    ebookContent: 'Chapter 1: Special Relativity\n\n1.1 Galilean Relativity\nIn classical mechanics, the laws of physics are assumed to be identical in all inertial frames of reference...\n\n1.2 Postulates of Einstein\n1. The laws of physics are the same in all inertial reference frames.\n2. The speed of light in vacuum has the same value c in all inertial frames.\n\n1.3 Time Dilation\nMoving clocks run slower by factor gamma = 1 / sqrt(1 - v^2/c^2).'
  },
  {
    id: 'b2',
    title: 'Advanced Engineering Mathematics',
    author: 'Erwin Kreyszig',
    category: 'Mathematics',
    isbn: '978-0470458365',
    shelf: 'Rack M-12',
    rating: '4.9',
    status: 'BORROWED',
    dueDate: '2026-09-18',
    isEbook: true,
    coverColor: '#7C3AED',
    coverIcon: '📐',
    summary: 'Comprehensive guide covering differential equations, linear algebra, complex analysis, and numerical methods.',
    ebookContent: 'Chapter 4: Linear Algebra and Matrices\n\n4.1 Systems of Linear Equations\nA system of m linear equations in n unknowns can be represented concisely as Ax = b...\n\n4.2 Eigenvalues and Eigenvectors\nLet A be an n x n matrix. A non-zero vector v is an eigenvector if Av = lambda * v.'
  },
  {
    id: 'b3',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Literature',
    isbn: '978-0061120084',
    shelf: 'Rack L-02',
    rating: '4.9',
    status: 'AVAILABLE',
    isEbook: true,
    coverColor: '#D97706',
    coverIcon: '📖',
    summary: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
    ebookContent: 'Part One\n\nChapter 1\nWhen he was nearly thirteen, my brother Jem got his arm badly broken at the elbow. When it healed, and Jem\'s fears of never being able to play football were assuaged, he was seldom self-conscious about his injury...'
  },
  {
    id: 'b4',
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Cormen, Leiserson, Rivest, Stein',
    category: 'Technology',
    isbn: '978-0262033848',
    shelf: 'Rack CS-01',
    rating: '5.0',
    status: 'BORROWED',
    dueDate: '2026-09-12',
    isEbook: true,
    coverColor: '#059669',
    coverIcon: '💻',
    summary: 'The standard textbook on modern computer algorithms covering dynamic programming, graph theory, and greedy heuristics.',
    ebookContent: 'Chapter 2: Getting Started\n\n2.1 Insertion Sort\nInsertion sort is an efficient algorithm for sorting a small number of elements. It works the way many people sort a hand of playing cards...\n\nAlgorithm Complexity: O(n^2) worst case, O(n) best case.'
  },
  {
    id: 'b5',
    title: 'World History: Patterns of Interaction',
    author: 'Roger B. Beck',
    category: 'History',
    isbn: '978-0547491127',
    shelf: 'Rack H-09',
    rating: '4.6',
    status: 'AVAILABLE',
    isEbook: false,
    coverColor: '#DC2626',
    coverIcon: '🏛️',
    summary: 'Exploring the rich tapestry of world civilizations from early river valley societies to modern geopolitical movements.',
    ebookContent: ''
  },
  {
    id: 'b6',
    title: 'Organic Chemistry: Structure & Function',
    author: 'K. Peter C. Vollhardt',
    category: 'Science',
    isbn: '978-1464120275',
    shelf: 'Rack S-11',
    rating: '4.7',
    status: 'AVAILABLE',
    isEbook: true,
    coverColor: '#0891B2',
    coverIcon: '🧪',
    summary: 'Explains chemical mechanisms, stereochemistry, and biochemical pathways with real-world applications.',
    ebookContent: 'Chapter 3: Alkanes and Conformations\n\n3.1 Structure of Methane and Ethane\nThe carbon atoms in alkanes are sp3 hybridized, forming tetrahedral geometries with bond angles of ~109.5 degrees...'
  }
];

const INITIAL_ISSUED = [
  {
    id: 'iss-1',
    bookId: 'b2',
    title: 'Advanced Engineering Mathematics',
    author: 'Erwin Kreyszig',
    coverIcon: '📐',
    coverColor: '#7C3AED',
    issueDate: '2026-09-01',
    dueDate: '2026-09-18',
    renewalsLeft: 2,
    status: 'ACTIVE'
  },
  {
    id: 'iss-2',
    bookId: 'b4',
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Cormen, Leiserson, Rivest, Stein',
    coverIcon: '💻',
    coverColor: '#059669',
    issueDate: '2026-08-25',
    dueDate: '2026-09-12',
    renewalsLeft: 1,
    status: 'ACTIVE'
  }
];

const CATEGORIES = ['All', 'Science', 'Mathematics', 'Technology', 'Literature', 'History'];

export default function LibraryScreen({ token, onBack }) {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'issued' | 'ebooks'
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [issuedBooks, setIssuedBooks] = useState(INITIAL_ISSUED);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedBook, setSelectedBook] = useState(null);
  const [readerBook, setReaderBook] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [booksRes, issuedRes] = await Promise.all([
          axios.get('/api/student/library/books', { headers }).catch(() => ({ data: null })),
          axios.get('/api/student/library/my-issued', { headers }).catch(() => ({ data: null }))
        ]);

        if (booksRes.data && Array.isArray(booksRes.data) && booksRes.data.length > 0) {
          setBooks(booksRes.data);
        }
        if (issuedRes.data && Array.isArray(issuedRes.data)) {
          setIssuedBooks(issuedRes.data);
        }
      } catch (err) {
        console.error('Error fetching library info', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLibraryData();
  }, [token]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleBorrow = (book) => {
    if (book.status === 'BORROWED') {
      showToast(`Reserved "${book.title}". You are #1 in queue!`);
      return;
    }
    const newIssued = {
      id: 'iss-' + Date.now(),
      bookId: book.id,
      title: book.title,
      author: book.author,
      coverIcon: book.coverIcon,
      coverColor: book.coverColor,
      issueDate: '2026-09-09',
      dueDate: '2026-09-23',
      renewalsLeft: 2,
      status: 'ACTIVE'
    };
    setIssuedBooks([newIssued, ...issuedBooks]);
    setBooks(books.map(b => b.id === book.id ? { ...b, status: 'BORROWED', dueDate: '2026-09-23' } : b));
    setSelectedBook(null);
    showToast(`Book "${book.title}" issued! Return by Sep 23, 2026.`);
  };

  const handleRenew = (issuedItem) => {
    if (issuedItem.renewalsLeft <= 0) {
      showToast('Maximum renewal limit reached for this title.');
      return;
    }
    setIssuedBooks(issuedBooks.map(item => {
      if (item.id === issuedItem.id) {
        return {
          ...item,
          dueDate: '2026-09-25',
          renewalsLeft: item.renewalsLeft - 1
        };
      }
      return item;
    }));
    showToast(`Extended due date to Sep 25, 2026 for "${issuedItem.title}"!`);
  };

  const filteredBooks = books.filter(b => {
    const matchesCategory = selectedCategory === 'All' || b.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'ebooks') {
      return matchesCategory && matchesSearch && b.isEbook;
    }
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.screen}>
      {/* ===== 1. HEADER ===== */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.titleCol}>
            <Text style={styles.headerTitle}>Digital Library & E-Books</Text>
            <Text style={styles.headerSub}>Smart Knowledge Hub & Catalog</Text>
          </View>
        </View>

        {/* Floating Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{issuedBooks.length}</Text>
            <Text style={styles.statLabel}>Issued Books</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{books.filter(b => b.isEbook).length}</Text>
            <Text style={styles.statLabel}>E-Books</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: '#10B981' }]}>$0.00</Text>
            <Text style={styles.statLabel}>Late Fines</Text>
          </View>
        </View>

        {/* Top Navigation Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'catalog' && styles.tabButtonActive]}
            onPress={() => setActiveTab('catalog')}
          >
            <Text style={[styles.tabText, activeTab === 'catalog' && styles.tabTextActive]}>📚 Catalog</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'issued' && styles.tabButtonActive]}
            onPress={() => setActiveTab('issued')}
          >
            <Text style={[styles.tabText, activeTab === 'issued' && styles.tabTextActive]}>
              🔖 My Issued ({issuedBooks.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'ebooks' && styles.tabButtonActive]}
            onPress={() => setActiveTab('ebooks')}
          >
            <Text style={[styles.tabText, activeTab === 'ebooks' && styles.tabTextActive]}>📱 E-Reader</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toast Banner */}
      {toastMessage ? (
        <View style={styles.toastBanner}>
          <Text style={styles.toastText}>✨ {toastMessage}</Text>
        </View>
      ) : null}

      {/* ===== 2. TAB BODY CONTENT ===== */}
      <ScrollView style={styles.bodyScroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#042940" style={{ marginTop: 40 }} />
        ) : activeTab === 'issued' ? (
          /* ===== MY ISSUED BOOKS TAB ===== */
          <View style={styles.tabContent}>
            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionHeading}>Currently Borrowed ({issuedBooks.length})</Text>
              <Text style={styles.sectionSub}>Max borrowing limit: 4 books</Text>
            </View>

            {issuedBooks.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>📖</Text>
                <Text style={styles.emptyTitle}>No Borrowed Books</Text>
                <Text style={styles.emptySub}>Explore the library catalog to check out books.</Text>
                <TouchableOpacity style={styles.exploreBtn} onPress={() => setActiveTab('catalog')}>
                  <Text style={styles.exploreBtnText}>Browse Catalog</Text>
                </TouchableOpacity>
              </View>
            ) : (
              issuedBooks.map(item => (
                <View key={item.id} style={styles.issuedCard}>
                  <View style={[styles.bookIconBadge, { backgroundColor: item.coverColor || '#0284C7' }]}>
                    <Text style={styles.bookEmoji}>{item.coverIcon || '📖'}</Text>
                  </View>

                  <View style={styles.issuedDetails}>
                    <Text style={styles.issuedTitle}>{item.title}</Text>
                    <Text style={styles.issuedAuthor}>by {item.author}</Text>
                    
                    <View style={styles.timelineRow}>
                      <View style={styles.timeBlock}>
                        <Text style={styles.timeLabel}>ISSUED</Text>
                        <Text style={styles.timeVal}>{item.issueDate}</Text>
                      </View>
                      <Text style={styles.timeArrow}>➔</Text>
                      <View style={styles.timeBlock}>
                        <Text style={styles.timeLabel}>DUE DATE</Text>
                        <Text style={[styles.timeVal, { color: '#EF4444' }]}>{item.dueDate}</Text>
                      </View>
                    </View>

                    <View style={styles.actionRow}>
                      <View style={styles.renewalBadge}>
                        <Text style={styles.renewalText}>{item.renewalsLeft} renewals left</Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.renewBtn} 
                        onPress={() => handleRenew(item)}
                      >
                        <Text style={styles.renewBtnText}>🔄 Extend +7 Days</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : (
          /* ===== CATALOG & E-BOOKS TABS ===== */
          <View style={styles.tabContent}>
            {/* Search Bar */}
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder={activeTab === 'ebooks' ? 'Search E-Books by title, author...' : 'Search library books, subjects, authors...'}
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Category Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.chip,
                    selectedCategory === cat && styles.chipActive
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[
                    styles.chipText,
                    selectedCategory === cat && styles.chipTextActive
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Books Grid / List */}
            <View style={styles.booksList}>
              {filteredBooks.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyIcon}>🔍</Text>
                  <Text style={styles.emptyTitle}>No matching books found</Text>
                  <Text style={styles.emptySub}>Try adjusting your search keywords or filter.</Text>
                </View>
              ) : (
                filteredBooks.map(book => (
                  <TouchableOpacity
                    key={book.id}
                    style={styles.bookCard}
                    activeOpacity={0.8}
                    onPress={() => setSelectedBook(book)}
                  >
                    <View style={[styles.bookSpine, { backgroundColor: book.coverColor }]}>
                      <Text style={styles.spineIcon}>{book.coverIcon}</Text>
                      {book.isEbook && (
                        <View style={styles.ebookPill}>
                          <Text style={styles.ebookPillText}>PDF</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.bookInfo}>
                      <View style={styles.categoryRow}>
                        <Text style={styles.categoryTag}>{book.category}</Text>
                        <Text style={styles.ratingText}>★ {book.rating}</Text>
                      </View>

                      <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                      <Text style={styles.bookAuthor}>by {book.author}</Text>
                      <Text style={styles.shelfText}>📍 {book.shelf}</Text>

                      <View style={styles.cardFooter}>
                        <View style={[
                          styles.statusBadge,
                          book.status === 'AVAILABLE' ? styles.statusAvailable : styles.statusBorrowed
                        ]}>
                          <Text style={[
                            styles.statusText,
                            book.status === 'AVAILABLE' ? styles.statusTextAvailable : styles.statusTextBorrowed
                          ]}>
                            {book.status === 'AVAILABLE' ? '✓ Available' : 'Checked Out'}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.quickActionBtn}
                          onPress={() => {
                            if (book.isEbook && activeTab === 'ebooks') {
                              setReaderBook(book);
                            } else {
                              setSelectedBook(book);
                            }
                          }}
                        >
                          <Text style={styles.quickActionText}>
                            {book.isEbook ? '📖 Read' : 'View'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ===== 3. BOOK DETAIL MODAL ===== */}
      <Modal
        visible={!!selectedBook}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedBook(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Book Details</Text>
              <TouchableOpacity onPress={() => setSelectedBook(null)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedBook && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalCoverRow}>
                  <View style={[styles.modalCoverBox, { backgroundColor: selectedBook.coverColor }]}>
                    <Text style={styles.modalCoverIcon}>{selectedBook.coverIcon}</Text>
                  </View>
                  <View style={styles.modalMeta}>
                    <Text style={styles.modalBookTitle}>{selectedBook.title}</Text>
                    <Text style={styles.modalBookAuthor}>by {selectedBook.author}</Text>
                    <Text style={styles.modalISBN}>ISBN: {selectedBook.isbn}</Text>
                    <Text style={styles.modalLocation}>Location: {selectedBook.shelf}</Text>
                  </View>
                </View>

                <View style={styles.synopsisBox}>
                  <Text style={styles.synopsisTitle}>SYNOPSIS</Text>
                  <Text style={styles.synopsisText}>{selectedBook.summary}</Text>
                </View>

                <View style={styles.modalButtonRow}>
                  {selectedBook.isEbook && (
                    <TouchableOpacity
                      style={styles.readEbookBtn}
                      onPress={() => {
                        const b = selectedBook;
                        setSelectedBook(null);
                        setReaderBook(b);
                      }}
                    >
                      <Text style={styles.readEbookText}>📱 Open E-Book</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.borrowModalBtn,
                      selectedBook.status === 'BORROWED' && styles.reserveModalBtn
                    ]}
                    onPress={() => handleBorrow(selectedBook)}
                  >
                    <Text style={styles.borrowModalText}>
                      {selectedBook.status === 'AVAILABLE' ? '📥 Issue / Borrow' : '⏳ Reserve Copy'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ===== 4. E-BOOK DIGITAL READER MODAL ===== */}
      <Modal
        visible={!!readerBook}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setReaderBook(null)}
      >
        <View style={styles.readerContainer}>
          <View style={styles.readerHeader}>
            <TouchableOpacity onPress={() => setReaderBook(null)} style={styles.readerBackBtn}>
              <Text style={styles.readerBackText}>✕ Close Reader</Text>
            </TouchableOpacity>
            <View style={styles.readerHeaderInfo}>
              <Text style={styles.readerTitle} numberOfLines={1}>{readerBook?.title}</Text>
              <Text style={styles.readerAuthor}>{readerBook?.author}</Text>
            </View>
          </View>

          <ScrollView style={styles.readerBody} contentContainerStyle={{ padding: 24 }}>
            <View style={styles.readerDocHeader}>
              <Text style={styles.readerFormatTag}>OFFICIAL E-TEXTBOOK EDITION</Text>
              <Text style={styles.readerDocTitle}>{readerBook?.title}</Text>
              <Text style={styles.readerDocMeta}>Department of Academic Learning • ISBN {readerBook?.isbn}</Text>
              <View style={styles.readerDivider} />
            </View>

            <Text style={styles.readerText}>
              {readerBook?.ebookContent || 'E-book digital contents are currently synchronizing from the institutional library cloud server.'}
            </Text>

            <View style={styles.readerFooterBox}>
              <Text style={styles.readerFooterNote}>End of preview chapter. Full access granted via School Digital Pass.</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1F5F9' },
  header: { backgroundColor: '#042940', paddingTop: 28, paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  backText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  titleCol: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  headerSub: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 12, marginBottom: 16, justifyContent: 'space-around', alignItems: 'center' },
  statBox: { alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.15)' },
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: 4 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabButtonActive: { backgroundColor: '#FFFFFF' },
  tabText: { fontSize: 12, fontWeight: '700', color: '#94A3B8' },
  tabTextActive: { color: '#042940' },
  toastBanner: { backgroundColor: '#10B981', paddingVertical: 10, paddingHorizontal: 16, marginHorizontal: 20, marginTop: 12, borderRadius: 12 },
  toastText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  bodyScroll: { flex: 1 },
  tabContent: { padding: 20 },
  sectionHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionHeading: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  sectionSub: { fontSize: 12, color: '#64748B' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, height: 48, elevation: 2, marginBottom: 16 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#0F172A' },
  clearIcon: { fontSize: 14, color: '#94A3B8', padding: 4 },
  categoryScroll: { marginBottom: 16 },
  chip: { backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  chipActive: { backgroundColor: '#042940', borderColor: '#042940' },
  chipText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  chipTextActive: { color: '#FFFFFF' },
  booksList: { gap: 14 },
  bookCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9', gap: 14 },
  bookSpine: { width: 72, height: 100, borderRadius: 12, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  spineIcon: { fontSize: 32 },
  ebookPill: { position: 'absolute', bottom: 6, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ebookPillText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  bookInfo: { flex: 1, justifyContent: 'space-between' },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryTag: { fontSize: 11, fontWeight: '700', color: '#0284C7', textTransform: 'uppercase' },
  ratingText: { fontSize: 12, fontWeight: '800', color: '#F59E0B' },
  bookTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginTop: 2 },
  bookAuthor: { fontSize: 12, color: '#64748B' },
  shelfText: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  statusAvailable: { backgroundColor: '#DCFCE7' },
  statusBorrowed: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 10, fontWeight: '800' },
  statusTextAvailable: { color: '#15803D' },
  statusTextBorrowed: { color: '#B91C1C' },
  quickActionBtn: { backgroundColor: '#042940', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
  quickActionText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  issuedCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 14, flexDirection: 'row', gap: 14, elevation: 2 },
  bookIconBadge: { width: 56, height: 72, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  bookEmoji: { fontSize: 26 },
  issuedDetails: { flex: 1 },
  issuedTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  issuedAuthor: { fontSize: 12, color: '#64748B', marginBottom: 8 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, padding: 8, marginBottom: 10, gap: 10 },
  timeBlock: { flex: 1 },
  timeLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700' },
  timeVal: { fontSize: 12, fontWeight: '800', color: '#0F172A' },
  timeArrow: { color: '#CBD5E1', fontSize: 12 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  renewalBadge: { backgroundColor: '#E0F2FE', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  renewalText: { fontSize: 11, color: '#0369A1', fontWeight: '700' },
  renewBtn: { backgroundColor: '#042940', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
  renewBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 32, alignItems: 'center', marginTop: 20 },
  emptyIcon: { fontSize: 36, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 16 },
  exploreBtn: { backgroundColor: '#042940', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  exploreBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalHeading: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  modalCloseBtn: { padding: 4 },
  modalCloseText: { fontSize: 18, color: '#94A3B8', fontWeight: '700' },
  modalCoverRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  modalCoverBox: { width: 80, height: 110, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  modalCoverIcon: { fontSize: 38 },
  modalMeta: { flex: 1, justifyContent: 'center' },
  modalBookTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  modalBookAuthor: { fontSize: 13, color: '#64748B', marginTop: 2 },
  modalISBN: { fontSize: 11, color: '#94A3B8', marginTop: 6 },
  modalLocation: { fontSize: 12, color: '#0284C7', fontWeight: '700', marginTop: 2 },
  synopsisBox: { backgroundColor: '#F8FAFC', borderRadius: 14, padding: 14, marginBottom: 20 },
  synopsisTitle: { fontSize: 11, fontWeight: '800', color: '#64748B', marginBottom: 6, letterSpacing: 1 },
  synopsisText: { fontSize: 13, color: '#334155', lineHeight: 20 },
  modalButtonRow: { flexDirection: 'row', gap: 12 },
  readEbookBtn: { flex: 1, backgroundColor: '#0284C7', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  readEbookText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  borrowModalBtn: { flex: 1, backgroundColor: '#042940', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  reserveModalBtn: { backgroundColor: '#D97706' },
  borrowModalText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  readerContainer: { flex: 1, backgroundColor: '#FBFBFB' },
  readerHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#042940', paddingVertical: 16, paddingHorizontal: 20, gap: 14 },
  readerBackBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16 },
  readerBackText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  readerHeaderInfo: { flex: 1 },
  readerTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  readerAuthor: { color: '#94A3B8', fontSize: 11 },
  readerBody: { flex: 1 },
  readerDocHeader: { marginBottom: 24 },
  readerFormatTag: { fontSize: 11, fontWeight: '800', color: '#0284C7', letterSpacing: 1, marginBottom: 6 },
  readerDocTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  readerDocMeta: { fontSize: 12, color: '#64748B' },
  readerDivider: { height: 1, backgroundColor: '#E2E8F0', marginTop: 16 },
  readerText: { fontSize: 15, color: '#1E293B', lineHeight: 26, fontFamily: 'monospace' },
  readerFooterBox: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 16, marginTop: 32, alignItems: 'center' },
  readerFooterNote: { fontSize: 12, color: '#64748B', fontStyle: 'italic' },
});
