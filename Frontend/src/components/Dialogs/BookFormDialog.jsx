import React, { useEffect, useState, useRef } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert as MuiAlert,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { addBooks, updateBook, fetchCategories, fetchLanguages } from "../../services/bookService";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-container": {
    overflow: "visible",
  },
  "& .MuiDialog-paper": {
    overflow: "visible",
  },
  "& .MuiDialogContent-root": {
    overflow: "visible",
  },
  "& .MuiDialogActions-root": {
    overflow: "visible",
  },
}));

const BookFormDialog = ({ open, onClose, onSubmit, initialData = null }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [ISBN, setIsbn] = useState("");

  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [languageOpen, setLanguageOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const clubId = useSelector((state) => state.clubSession.clubId);

  /* refs for click-outside handling */
  const langRef = useRef(null);
  const catRef = useRef(null);

  useEffect(() => {
    if (initialData && open) {
      setTitle(initialData.title || "");
      setAuthor(initialData.author || "");
      setIsbn(initialData.ISBN || "");

      if (initialData.language) {
        setSelectedLanguage({
          id: initialData.language.id || initialData.languageId,
          LanguageName: initialData.language.LanguageName || initialData.languageName
        });
      }

      if (initialData.category) {
        setSelectedCategory({
          id: initialData.category.id || initialData.categoryId,
          CategoryName: initialData.category.CategoryName || initialData.categoryName
        });
      }

      setHasChanges(false);
    }
  }, [initialData, open]);

  useEffect(() => {
    if (!open) return;

    const checkForChanges = () => {
      if (!initialData) {
        // For new book - any field with content means there are changes
        const hasContent = title.trim() || author.trim() || ISBN.trim() || selectedLanguage || selectedCategory;
        setHasChanges(!!hasContent);
      } else {
        // For editing - compare with initial values
        const titleChanged = title !== (initialData.title || "");
        const authorChanged = author !== (initialData.author || "");
        const isbnChanged = ISBN !== (initialData.ISBN || "");

        const initialLangId = initialData.language?.id || initialData.languageId;
        const langChanged = selectedLanguage?.id !== initialLangId;

        const initialCatId = initialData.category?.id || initialData.categoryId;
        const catChanged = selectedCategory?.id !== initialCatId;

        setHasChanges(titleChanged || authorChanged || isbnChanged || langChanged || catChanged);
      }
    };

    checkForChanges();
  }, [title, author, ISBN, selectedLanguage, selectedCategory, initialData, open]);

  useEffect(() => {
    if (!open) return;

    const loadDropdownData = async () => {
      try {
        const [languagesData, categoriesData] = await Promise.all([
          fetchLanguages(),
          fetchCategories()
        ]);

        setLanguages(languagesData);
        setCategories(categoriesData);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to load form data",
          severity: "error"
        });
      }
    };

    loadDropdownData();
  }, [open]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!author.trim()) {
      errs.author = "Author is required";
    } else if (!/^[a-zA-Z\s.]+$/.test(author.trim())) {
      errs.author = "Author name can only contain letters";
    }
    if (!ISBN.trim()) {
      errs.ISBN = "ISBN is required";
    } else if (!/^\d{10,13}$/.test(ISBN.trim())) {
      errs.ISBN = "ISBN must be a number between 10 to 13 digits";
    }
    if (!selectedLanguage) errs.language = "Language is required";
    if (!selectedCategory) errs.category = "Category is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
    if (errors.author) {
      setErrors(prev => ({ ...prev, author: '' }));
    }
  };

  const handleIsbnChange = (e) => {
    setIsbn(e.target.value);
    if (errors.ISBN) {
      setErrors(prev => ({ ...prev, ISBN: '' }));
    }
  };

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setLanguageOpen(false);
    if (errors.language) {
      setErrors(prev => ({ ...prev, language: '' }));
    }
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCategoryOpen(false);
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const bookData = {
        title,
        author,
        ISBN,
        languageId: selectedLanguage.id,
        categoryId: selectedCategory.id,
        token,
        clubId
      };
      // console.log("Submitting book data:", bookData);

      let res;
      if (initialData) {
        res = await updateBook({
          ...bookData,
          bookId: initialData.id
        });
      } else {
        res = await addBooks(bookData);
      }

      if (res.success) {
        setSnackbar({
          open: true,
          message: `Book successfully ${initialData ? 'updated' : 'added'}!`,
          severity: "success"
        });
        onSubmit?.(res.data);
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: res.message || `Failed to ${initialData ? 'update' : 'add'} book`,
          severity: "error"
        });
      }
    } catch (e) {
      console.error(e);
      setSnackbar({
        open: true,
        message: "Something went wrong.",
        severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setIsbn("");
    setSelectedLanguage(null);
    setSelectedCategory(null);
    setErrors({});
    setHasChanges(false);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{initialData ? 'Edit Book' : 'Add a New Book'}</DialogTitle>

        <DialogContent dividers className="bg-br-blue-light">
          {/* Title */}
          <div className="mb-4">
            <label className="block mb-2 font-bold text-sm text-br-blue-medium">Title</label>
            <input
              value={title}
              onChange={handleTitleChange}
              className="w-full bg-white border border-br-gray-dark py-3 px-4 rounded-xl"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Author */}
          <div className="mb-4">
            <label className="block mb-2 font-bold text-sm text-br-blue-medium">Author Name</label>
            <input
              value={author}
              onChange={handleAuthorChange}
              className="w-full bg-white border border-br-gray-dark py-3 px-4 rounded-xl"
            />
            {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author}</p>}
          </div>

          {/* ISBN */}
          <div className="mb-4">
            <label className="block mb-2 font-bold text-sm text-br-blue-medium">ISBN Number</label>
            <input
              value={ISBN}
              maxLength={13}
              onChange={handleIsbnChange}
              className="w-full bg-white border border-br-gray-dark py-3 px-4 rounded-xl"
            />
            {errors.ISBN && <p className="text-xs text-red-500 mt-1">{errors.ISBN}</p>}
          </div>

          {/* ----------------- Language dropdown ----------------- */}
          <div className="mb-4 relative" ref={langRef}>
            <label className="block mb-2 font-bold text-sm text-br-blue-medium">Language</label>
            <button
              type="button"
              onClick={() => setLanguageOpen((o) => !o)}
              className="w-full bg-white border border-br-gray-dark py-3 px-4 rounded-xl flex justify-between items-center text-left"
            >
              {selectedLanguage ? selectedLanguage.LanguageName : "Select a language"}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {languageOpen && (
              <ul className="absolute z-[60] mt-1 w-full bg-white border border-br-gray-dark rounded-xl shadow-lg max-h-60 overflow-auto">
                {languages.length ? (
                  languages.map((lang) => (
                    <li
                      key={lang.id}
                      onClick={() => handleLanguageSelect(lang)}
                      className="px-4 py-3 cursor-pointer hover:bg-br-blue-light"
                    >
                      {lang.LanguageName}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-gray-400 select-none">No languages available</li>
                )}
              </ul>
            )}
            {errors.language && <p className="text-xs text-red-500 mt-1">{errors.language}</p>}
          </div>

          {/* ----------------- Category dropdown ----------------- */}
          <div className="mb-4 relative" ref={catRef}>
            <label className="block mb-2 font-bold text-sm text-br-blue-medium">Category</label>
            <button
              type="button"
              onClick={() => setCategoryOpen((o) => !o)}
              className="w-full bg-white border border-br-gray-dark py-3 px-4 rounded-xl flex justify-between items-center text-left"
            >
              {selectedCategory ? selectedCategory.CategoryName : "Select a category"}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {categoryOpen && (
              <ul className="absolute z-[60] mt-1 w-full bg-white border border-br-gray-dark rounded-xl shadow-lg max-h-60 overflow-auto">
                {categories.length ? (
                  categories.map((cat) => (
                    <li
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat)}
                      className="px-4 py-3 cursor-pointer hover:bg-br-blue-light"
                    >
                      {cat.CategoryName}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-gray-400 select-none">No categories available</li>
                )}
              </ul>
            )}
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isLoading || !hasChanges}
            startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
          >
            {isLoading
              ? (initialData ? 'Saving...' : 'Adding...')
              : (initialData ? 'Save Changes' : 'Add Book')
            }
          </Button>
        </DialogActions>
      </StyledDialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BookFormDialog;