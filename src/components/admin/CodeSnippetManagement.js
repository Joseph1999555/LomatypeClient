import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CodeSnippetManagement = () => {
    const [snippets, setSnippets] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [modules, setModules] = useState([]);
    const [types, setTypes] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [newSnippet, setNewSnippet] = useState({
        language_id: '',
        module_id: '',
        type_id: '',
        difficulty_id: '',
        snippet_text: '',
        result: ''
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Open/Close Modal
    const [editingSnippet, setEditingSnippet] = useState(null); // Store the snippet currently being edited
    const [snippetId, setSnippetId] = useState(null);

    const navigate = useNavigate();

    const addSnippet = async () => {
        if (!newSnippet.language_id || !newSnippet.module_id || !newSnippet.type_id || !newSnippet.difficulty_id || !newSnippet.snippet_text) {
            alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://lomatypeserver.onrender.com/admin/create/snippet', newSnippet, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            getAllData();
            setNewSnippet({
                language_id: '',
                module_id: '',
                type_id: '',
                difficulty_id: '',
                snippet_text: '',
                result: ''
            });
        } catch (error) {
            console.error('Error adding code snippet:', error);
        }
    };

    const deleteSnippet = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://lomatypeserver.onrender.com/admin/delete/snippet/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(`Snippet with ID ${id} deleted`);
            getAllData();
        } catch (error) {
            console.error('Error deleting snippet:', error);
        }
    };

    const getAllData = async () => {
        const token = localStorage.getItem('token');
        Promise.all([
            axios.get('https://lomatypeserver.onrender.com/admin/fetch/snippets', { headers: { Authorization: `Bearer ${token}` } }),
            axios.get('https://lomatypeserver.onrender.com/admin/fetch/languages', { headers: { Authorization: `Bearer ${token}` } }),
            axios.get('https://lomatypeserver.onrender.com/admin/fetch/modules', { headers: { Authorization: `Bearer ${token}` } }),
            axios.get('https://lomatypeserver.onrender.com/admin/fetch/types', { headers: { Authorization: `Bearer ${token}` } }),
            axios.get('https://lomatypeserver.onrender.com/admin/fetch/difficulties', { headers: { Authorization: `Bearer ${token}` } }),
        ])
            .then(([snippetsRes, languagesRes, modulesRes, typesRes, difficultiesRes]) => {
                setSnippets(snippetsRes.data);
                setLanguages(languagesRes.data);
                setModules(modulesRes.data);
                setTypes(typesRes.data);
                setDifficulties(difficultiesRes.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const handleModuleChange = (e) => {
        const selectedModuleId = e.target.value;
        setNewSnippet({ ...newSnippet, module_id: selectedModuleId, type_id: '' });
        setFilteredTypes(types.filter((type) => type.module_id._id === selectedModuleId));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd, value } = e.target;
            const newValue = value.substring(0, selectionStart) + '\t' + value.substring(selectionEnd);

            // Adjust to ensure it sets according to the intended snippet
            if (e.target.placeholder === "โค้ด") {
                setNewSnippet({ ...newSnippet, snippet_text: newValue });
            } else {
                setEditingSnippet({ ...editingSnippet, snippet_text: newValue });
            }

            e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
        }
    };

    const navigateDashboard = () => {
        navigate('/admin');
    };

    useEffect(() => {
        getAllData();
    }, []);

    const [currentPage, setCurrentPage] = useState(1); // Current page being displayed
    const rowsPerPage = 10; // Number of rows to display per page

    const indexOfLastSnippet = currentPage * rowsPerPage;
    const indexOfFirstSnippet = indexOfLastSnippet - rowsPerPage;
    const currentSnippets = snippets.slice(indexOfFirstSnippet, indexOfLastSnippet);
    const totalPages = Math.ceil(snippets.length / rowsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];

        // Add button to go to the first page <<
        if (currentPage > 1) {
            pageNumbers.push(
                <button key="first" onClick={() => paginate(1)}>{'<<'}</button>
            );
        }

        // Previous button <
        if (currentPage > 1) {
            pageNumbers.push(
                <button key="prev" onClick={() => paginate(currentPage - 1)}>{'<'}</button>
            );
        }

        // If the current page is more than 3, show ... before page numbers
        if (currentPage > 3) {
            pageNumbers.push(<span key="dots-prev">...</span>);
        }

        // Show page numbers close to the current page (max 3 pages)
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={currentPage === i ? 'activePage' : ''}
                >
                    {i}
                </button>
            );
        }

        // If there are more than 3 pages and not at the end, show ... after page numbers
        if (currentPage < totalPages - 2) {
            pageNumbers.push(<span key="dots-next">...</span>);
        }

        // Next button >
        if (currentPage < totalPages) {
            pageNumbers.push(
                <button key="next" onClick={() => paginate(currentPage + 1)}>{'>'}</button>
            );
        }

        // Add button to go to the last page >>
        if (currentPage < totalPages) {
            pageNumbers.push(
                <button key="last" onClick={() => paginate(totalPages)}>{'>>'}</button>
            );
        }

        return pageNumbers;
    };

    const openEditModal = (snippet) => {
        setSnippetId(snippet);
        const snippetToEdit = snippets.find(s => s._id === snippet);
        setEditingSnippet(snippetToEdit); // Set the snippet to be edited
        setIsEditModalOpen(true);   // Open Modal
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);  // Close Modal
        setEditingSnippet(null);    // Clear the snippet being edited
    };

    const updateSnippet = async () => {
        if (!editingSnippet.snippet_text || !editingSnippet.result) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://lomatypeserver.onrender.com/admin/update/snippet/${snippetId}`, editingSnippet, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            getAllData(); // Fetch new data after update
            closeEditModal(); // Close modal after update
        } catch (error) {
            console.error('Error updating snippet:', error);
        }
    };

    return (
        <div className="pageContainer">
            <div className="container">
                <h1 className="header">การจัดการโค้ดฝึกพิมพ์</h1>

                <button className="navButton" onClick={navigateDashboard}>Back To Dashboard</button>

                <div className="section">
                    <h2>เพิ่มโค้ดใหม่</h2>
                    <div className="formGroup">
                        <select
                            className="select"
                            value={newSnippet.language_id}
                            onChange={(e) => setNewSnippet({ ...newSnippet, language_id: e.target.value })}
                        >
                            <option value="">เลือกภาษา</option>
                            {languages.map((lang) => (
                                <option key={lang._id} value={lang._id}>{lang.language_name}</option>
                            ))}
                        </select>

                        <select
                            className="select"
                            value={newSnippet.module_id}
                            onChange={handleModuleChange}
                        >
                            <option value="">เลือกโมดูล</option>
                            {modules.map((mod) => (
                                <option key={mod._id} value={mod._id}>{mod.module_name}</option>
                            ))}
                        </select>

                        <select
                            className="select"
                            value={newSnippet.type_id}
                            onChange={(e) => setNewSnippet({ ...newSnippet, type_id: e.target.value })}
                        >
                            <option value="">เลือกประเภท</option>
                            {filteredTypes.map((type) => (
                                <option key={type._id} value={type._id}>{type.type_name}</option>
                            ))}
                        </select>

                        <select
                            className="select"
                            value={newSnippet.difficulty_id}
                            onChange={(e) => setNewSnippet({ ...newSnippet, difficulty_id: e.target.value })}
                        >
                            <option value="">เลือกความยาก</option>
                            {difficulties.map((diff) => (
                                <option key={diff._id} value={diff._id}>{diff.difficult_level}</option>
                            ))}
                        </select>

                        <textarea
                            className="textArea"
                            placeholder="โค้ด"
                            value={newSnippet.snippet_text}
                            onChange={(e) => setNewSnippet({ ...newSnippet, snippet_text: e.target.value })}
                            onKeyDown={handleKeyDown}
                        />

                        <textarea
                            className="textArea"
                            placeholder="ผลลัพธ์"
                            value={newSnippet.result}
                            onChange={(e) => setNewSnippet({ ...newSnippet, result: e.target.value })}
                        />
                    </div>

                    <button className="button" onClick={addSnippet}>เพิ่มโค้ด</button>
                </div>

                <div className="section">
                    <h2>โค้ดที่มีอยู่</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ภาษา</th>
                                <th>โมดูล</th>
                                <th>ประเภท</th>
                                <th>ความยาก</th>
                                <th>โค้ด</th>
                                <th>ผลลัพธ์</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentSnippets.map((snippet) => (
                                <tr key={snippet._id}>
                                    <td>{snippet.language_id?.language_name}</td>
                                    <td>{snippet.module_id?.module_name}</td>
                                    <td>{snippet.type_id?.type_name}</td>
                                    <td>{snippet.difficulty_id?.difficult_level}</td>
                                    <td><pre>{snippet.snippet_text}</pre></td>
                                    <td>{snippet.result}</td>
                                    <td>
                                        <button className="editButton" onClick={() => openEditModal(snippet._id)}>แก้ไข</button>
                                        <button className="deleteButton" onClick={() => deleteSnippet(snippet._id)}>ลบ</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        {renderPageNumbers()}
                    </div>
                </div>

                {isEditModalOpen && (
                    <div className="modal">
                        <div className="modalContent">
                            <h2>แก้ไขโค้ด</h2>
                            <textarea
                                className="textArea"
                                placeholder="โค้ด"
                                value={editingSnippet.snippet_text}
                                onChange={(e) => setEditingSnippet({ ...editingSnippet, snippet_text: e.target.value })}
                                onKeyDown={handleKeyDown}
                            />
                            <textarea
                                className="textArea"
                                placeholder="ผลลัพธ์"
                                value={editingSnippet.result}
                                onChange={(e) => setEditingSnippet({ ...editingSnippet, result: e.target.value })}
                            />
                            <button className="button" onClick={updateSnippet}>บันทึกการเปลี่ยนแปลง</button>
                            <button className="button" onClick={closeEditModal}>ปิด</button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .pageContainer {
                    width: 100%;
                    display: flex; 
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                }
                .container {
                    width: 80%;
                        padding: 20px;
                        border: 1px solid #BF7AA0; /* Medium pink border */
                        border-radius: 10px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        background-color: rgba(2, 56, 89, 0.9);
                }
                .header {
                    font-size: 35px;
                    margin-bottom: 20px;
                    color: #fff; /* Pink */

                }
                .section {
                    margin-bottom: 30px;
                    color: #fff; /* Pink */
                }
                .formGroup {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 10px;
                }
                .select, .textArea {
                    margin-bottom: 10px;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 16px;
                    background-color: rgba(255, 255, 255, 0.9);
                }
                .button {
                    background-color: #007BFF;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-right: 10px;
                }
                .button:hover {
                    background-color: #0056b3;
                }
                .table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .table th, .table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                    color: #fff;
                }
                .table th {
                    background-color: #black;
                }
                    pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
                .editButton {
                    background-color: #FFC107;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 5px;
                }
                .editButton:hover {
                    background-color: #e0a800;
                }
                .deleteButton {
                    background-color: #DC3545;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .deleteButton:hover {
                    background-color: #c82333;
                }
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .modalContent {
                    background-color: white;
                    padding: 20px;
                    border-radius: 5px;
                    width: 400px;
                }
                .pagination {
                    display: flex;
                    justify-content: center;
                    margin-top: 10px;
                }
                .activePage {
                    font-weight: bold;
                }
                .activePage:hover {
                    cursor: default;
                }
                .textArea {
                    height: 100px;
                }
                    .navButton {
                        padding: 10px 15px;
                        font-size: 1rem;
                        cursor: pointer;
                        border-radius: 5px;
                        border: none;
                        background-color: orange; /* Red for logout */
                        color: #fff;
                        transition: background-color 0.3s ease;
                        margin-top: 20px; /* Spacing above logout button */
                    }

                    .navButton:hover {
                        background-color: #c82333; /* Darker red on hover */
                    }
            `}</style>
        </div>
    );
};

export default CodeSnippetManagement;
