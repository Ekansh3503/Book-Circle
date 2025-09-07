import React, { useState } from "react";
import Languages from "../../components/Listing/Languages";
import Categories from "../../components/Listing/Categories";
import LanguageDialog from "../../components/Dialogs/LanguageDialog"; // renamed and enhanced AddLanguage
import CategoryDialog from "../../components/Dialogs/CategoryDialog";
import Titlebox from "../../components/Header/TitleBox";

function CategoryLanguageList() {
  const [reloadLanguageKey, setReloadLanguageKey] = useState(0);
  const [reloadCategoryKey, setReloadCategoryKey] = useState(0);

  // For opening dialog in add/edit mode
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [languageToEdit, setLanguageToEdit] = useState(null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const handleLanguageAddedOrUpdated = () => {
    setReloadLanguageKey((prev) => prev + 1);
  };

  const handleCategoryAddedorUpdated = () => {
    setReloadCategoryKey((prev) => prev + 1);
  };

  const handleAddLanguageClick = () => {
    setLanguageToEdit(null);
    setLanguageDialogOpen(true);
  };

  const handleEditLanguage = (language) => {
    setLanguageToEdit(language);
    setLanguageDialogOpen(true);
  };

  const handleAddCategoryClick = () => {
    setCategoryToEdit(null);
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category) => {
    setCategoryToEdit(category);
    setCategoryDialogOpen(true);
  };

  return (
    <div className="flex flex-row w-full h-screen gap-2">
      <div className="w-1/2 flex flex-col rounded-md space-y-1 h-full">
        <Titlebox
          pageTitle="Languages"
          customButton={
            <button
              className="text-blue-600 hover:bg-br-blue-dark flex flex-row items-center justify-end bg-br-blue-medium gap-1 px-3 py-3 rounded-xl text-sm text-white"
              onClick={handleAddLanguageClick}
            >
              + Add Language
            </button>
          }
        />

        <div className="overflow-y-auto no-scrollbar">
          <Languages
            reloadKey={reloadLanguageKey}
            onEditLanguage={handleEditLanguage}
          />
        </div>
      </div>

      <div className="w-1/2 flex flex-col rounded-md space-y-1">
        <Titlebox
          pageTitle="Categories"
          customButton={
            <button
              className="text-blue-600 hover:bg-br-blue-dark flex flex-row items-center justify-end bg-br-blue-medium gap-1 px-3 py-3 rounded-xl text-sm text-white"
              onClick={handleAddCategoryClick}
            >
              + Add Category
            </button>
          }
        />

        <div className="overflow-y-auto no-scrollbar">
          <Categories
            reloadKey={reloadCategoryKey}
            onEditCategory={handleEditCategory}
          />
        </div>
      </div>

      {/* Shared Add/Edit Dialog */}
      <LanguageDialog
        open={languageDialogOpen}
        setOpen={setLanguageDialogOpen}
        languageToEdit={languageToEdit}
        onLanguageAdded={handleLanguageAddedOrUpdated}
        onLanguageUpdated={handleLanguageAddedOrUpdated}
      />

      <CategoryDialog
        open={categoryDialogOpen}
        setOpen={setCategoryDialogOpen}
        categoryToEdit={categoryToEdit}
        onCategoryAdded={handleCategoryAddedorUpdated}
        onCategoryUpdated={handleCategoryAddedorUpdated}
      />
    </div>
  );
}

export default CategoryLanguageList;
