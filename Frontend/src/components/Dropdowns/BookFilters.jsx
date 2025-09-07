import React, { useEffect, useState } from 'react'
import { FaSortDown } from "react-icons/fa6"
import Checkbox from './Checkbox'
import RadioButton from './RadioButton';
import axios from 'axios';
import { CircularProgress, Skeleton } from '@mui/material';

const Status_Options = [
    { id: 'all', label: 'All' },
    { id: 'borrowed', label: 'Borrowed' },
    { id: 'available', label: 'Available' },   
];

const BookFilters = ({onFilterChange}) => {
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedCategories, setSelectedCategories] = useState({});
    const [selectedLanguages, setSelectedLanguages] = useState({});

    const [isStatusVisible, setIsStatusVisible] = useState(true);
    const [isCategoriesVisible, setIsCategoriesVisible] = useState(true);
    const [isLanguagesVisible, setIsLanguagesVisible] = useState(true);

    const [Categories, setCategories] = useState([]);

    const [Languages, setLanguages] = useState([]);
    const [LoadingOne, setLoadingOne] = useState(false);
    const [LoadingTwo, setLoadingTwo] = useState(false);
    
    const getcategory = async () => {
        try {
            
            axios.defaults.baseURL = "http://localhost:3000/";
            
            const { data } = await axios.get('/api/v1/category/getallcategory');

            // console.log(data);
            if (data.success) {
                // console.log(data.categories.count);
                await setCategories(data.categories.rows)
            }
            
        } catch (error) {
            console.log(" Error fetching categories", error)
        } finally {
            setLoadingOne(false);
        }
    }

    const getLanguage = async () => {
        try {

            axios.defaults.baseURL = "http://localhost:3000/";
            
            const { data } = await axios.get('/api/v1/language/getalllanguage');

            // console.log(data);
            if (data.success) {
                // console.log(data.languages.count);
                await setLanguages(data.languages.rows)
            }
            
        } catch (error) {
            console.log(" Error fetching languages", error)
        } finally {
            setLoadingTwo(false);
        }
    }

    useEffect(() => {
        setLoadingOne(true);
        getcategory();
        setLoadingTwo(true);
        getLanguage()
    }, [])
    

    const handleStatusChange = (value) => {
        setSelectedStatus(value);
    };

    const handleCategoryChange = (id) => (isChecked) => {
        setSelectedCategories(prev => ({
            ...prev,
            [id]: isChecked
        }));
    };

    const handleLanguageChange = (id) => (isChecked) => {
        setSelectedLanguages(prev => ({
            ...prev,
            [id]: isChecked
        }));
    };

    useEffect(() => {
        // Whenever filters change, notify parent
        const activeFilters = {
            status: selectedStatus,
            categories: Object.entries(selectedCategories)
                .filter(([_, isChecked]) => isChecked)
                .map(([id, _]) => parseInt(id)),
            languages: Object.entries(selectedLanguages)
                .filter(([_, isChecked]) => isChecked)
                .map(([id, _]) => parseInt(id))
        };
        // console.log("Active Filters: ", activeFilters);
        onFilterChange(activeFilters);
    }, [selectedStatus, selectedCategories, selectedLanguages]);

    return (
        <div className='h-screen min-h-[1005px] w-1/5 flex flex-col bg-white p-5 rounded-bl-[var(--br-radius)] rounded-tl-[var(--br-radius)] '>
            <h1 className='font-bold text-lg flex-none'>Filters</h1>

            <div className=' flex-1 mt-4 space-y-4 '>
                {/* Status Filters */}
                <div className='space-y-2'>
                    <div
                        className='flex items-center justify-between bg-white rounded-lg sticky top-0 z-10 cursor-pointer'
                        onClick={() => setIsStatusVisible(!isStatusVisible)}
                    >
                        <h2 className='font-semibold'>Status</h2>
                        <FaSortDown className={`transform transition-transform duration-200 ${isStatusVisible ? '' : 'rotate-180'}`} />
                    </div>
                    <hr className="border-t-2 border-br-black" />
                    {isStatusVisible && (
                        <div className='flex flex-col space-y-2 p-3'>
                            {Status_Options.map(option => (
                                <RadioButton
                                    key={option.id}
                                    label={option.label}
                                    checked={selectedStatus === option.id}
                                    onChange={handleStatusChange}
                                    name="status"
                                    value={option.id}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Categories Filters */}
                <div className='space-y-2 '>
                    <div
                        className='flex items-center justify-between bg-white rounded-lg sticky top-0 z-10 cursor-pointer'
                        onClick={() => setIsCategoriesVisible(!isCategoriesVisible)}
                    >
                        <h2 className='font-semibold'>Categories</h2>
                        <FaSortDown className={`transform transition-transform duration-200 ${isCategoriesVisible ? '' : 'rotate-180'}`} />
                    </div>
                    <hr className="border-t-2 border-br-black" />
                    {isCategoriesVisible && (
                        <div className='flex flex-col space-y-2 p-3'>
                            <div className='flex flex-col h-80 overflow-y-auto space-y-2'>
                                {LoadingOne ? (
                                    [...Array(12)].map((_, i) => (
                                    <Skeleton variant="text" height={38} width="100%" />
                                    ))
                                ) : ( Categories.map(option => (
                                        <Checkbox
                                            key={option.id}
                                            label={option.CategoryName}
                                            checked={selectedCategories[option.id] || false}
                                            onChange={handleCategoryChange(option.id)}
                                        />
                                    ))
                                )}
                                
                            </div>
                        </div>
                    )}
                </div>

                {/* Languages Filters */}
                <div className='space-y-2'>
                    <div
                        className='flex items-center justify-between bg-white rounded-lg sticky top-0 z-10 cursor-pointer'
                        onClick={() => setIsLanguagesVisible(!isLanguagesVisible)}
                    >
                        <h2 className='font-semibold'>Languages</h2>
                        <FaSortDown className={`transform transition-transform duration-200 ${isLanguagesVisible ? '' : 'rotate-180'}`} />
                    </div>
                    <hr className="border-t-2 border-br-black" />
                    {isLanguagesVisible && (
                        <div className='flex flex-col space-y-2 p-3'>
                            <div className='flex flex-col h-73 overflow-y-auto space-y-2'>
                                {LoadingTwo ? (
                                    [...Array(12)].map((_, i) => (
                                    <Skeleton variant="text" height={38} width="100%" />
                                    ))
                                ) : ( Languages.map(option => (
                                    <Checkbox
                                        key={option.id}
                                        label={option.LanguageName}
                                        checked={selectedLanguages[option.id] || false}
                                        onChange={handleLanguageChange(option.id)}
                                    />
                                ))
                            )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookFilters