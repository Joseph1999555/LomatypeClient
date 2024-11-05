import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Admin.module.css';

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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // เปิดปิด Modal
    const [editingSnippet, setEditingSnippet] = useState(null); // เก็บข้อมูล snippet ที่กำลังแก้ไข
    const [snippetId, setSnippetId] = useState(null);


    const navigate = useNavigate();


    const addSnippet = async () => {
        if (!newSnippet.language_id || !newSnippet.module_id || !newSnippet.type_id || !newSnippet.difficulty_id || !newSnippet.snippet_text) {
            alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3005/admin/create/snippet', newSnippet, {
                headers: {
                    'Authorization': Bearer ${token}
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
            await axios.delete(http://localhost:3005/admin/delete/snippet/${id}, {
                headers: {
                    'Authorization': Bearer ${token}
                }
            });
            console.log(Snippet with ID ${id} deleted);
            getAllData();
        } catch (error) {
            console.error('Error deleting snippet:', error);
        }
    };

    const getAllData = async () => {
        const token = localStorage.getItem('token');
        Promise.all([
            axios.get('http://localhost:3005/admin/fetch/snippets', { headers: { Authorization: Bearer ${token} } }),
            axios.get('http://localhost:3005/admin/fetch/languages', { headers: { Authorization: Bearer ${token} } }),
            axios.get('http://localhost:3005/admin/fetch/modules', { headers: { Authorization: Bearer ${token} } }),
            axios.get('http://localhost:3005/admin/fetch/types', { headers: { Authorization: Bearer ${token} } }),
            axios.get('http://localhost:3005/admin/fetch/difficulties', { headers: { Authorization: Bearer ${token} } }),
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
            
            // ปรับให้แน่ใจว่าได้ตั้งค่าตาม snippet ที่ต้องการ
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

    const [currentPage, setCurrentPage] = useState(1); // หน้าที่กำลังแสดง
    const rowsPerPage = 10; // จำนวนแถวที่จะแสดงต่อหน้า

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

        // เพิ่มปุ่มไปหน้าแรก <<
        if (currentPage > 1) {
            pageNumbers.push(
                <button key="first" onClick={() => paginate(1)}>{'<<'}</button>
            );
        }

        // ปุ่มย้อนกลับ <
        if (currentPage > 1) {
            pageNumbers.push(
                <button key="prev" onClick={() => paginate(currentPage - 1)}>{'<'}</button>
            );
        }

        // ถ้าหน้าปัจจุบันเกิน 3 แสดง ... ก่อนเลขหน้า
        if (currentPage > 3) {
            pageNumbers.push(<span key="dots-prev">...</span>);
        }

        // แสดงเลขหน้าใกล้กับหน้าปัจจุบัน (สูงสุด 3 หน้า)
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={currentPage === i ? styles.activePage : ''}
                >
                    {i}
                </button>
            );
        }

        // ถ้ามีหน้ามากกว่า 3 และไม่ได้อยู่ท้ายสุด แสดง ... หลังเลขหน้า
        if (currentPage < totalPages - 2) {
            pageNumbers.push(<span key="dots-next">...</span>);
        }

        // ปุ่มหน้าถัดไป >
        if (currentPage < totalPages) {
            pageNumbers.push(
                <button key="next" onClick={() => paginate(currentPage + 1)}>{'>'}</button>
            );
        }

        // เพิ่มปุ่มไปหน้าสุดท้าย >>
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
        setEditingSnippet(snippetToEdit); // เซ็ตข้อมูล snippet ที่ต้องการแก้ไข
        setIsEditModalOpen(true);   // เปิด Modal
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);  // ปิด Modal
        setEditingSnippet(null);    // ล้างข้อมูล snippet ที่กำลังแก้ไข
    };

    const updateSnippet = async () => {
        if (!editingSnippet.snippet_text || !editingSnippet.result) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
        console.log('snippetId:', snippetId);
        console.log('editingSnippet:', editingSnippet);
        try {
            const token = localStorage.getItem('token');
            await axios.put(http://localhost:3005/admin/update/snippet/${snippetId}, editingSnippet, {
                headers: {
                    'Authorization': Bearer ${token}
                }
            });
            getAllData(); // เรียกข้อมูลใหม่หลังจากอัปเดต
            closeEditModal(); // ปิด Modal หลังจากอัปเดตเสร็จ
        } catch (error) {
            console.error('Error updating snippet:', error);
        }
    };



    return (
        <div className="pageContainer">
            <div className={styles.container}>
                <h1 className={styles.header}>การจัดการโค้ดฝึกพิมพ์</h1>

                <button className={styles.button} onClick={navigateDashboard}>Back To Dashbord</button>

                <div className={styles.section}>
                    <h2>เพิ่มโค้ดใหม่</h2>
                    <div className={styles.formGroup}>
                        <select
                            className={styles.select}
                            value={newSnippet.language_id}
                            onChange={(e) => setNewSnippet({ ...newSnippet, language_id: e.target.value })}
                        >
                            <option value="">เลือกภาษา</option>
                            {languages.map((lang) => (
                                <option key={lang._id} value={lang._id}>
                                    {lang.language_name}
                                </option>
                            ))}
                        </select>

                        <select
                            className={styles.select}
                            value={newSnippet.module_id}
                            onChange={handleModuleChange}
                        >
                            <option value="">เลือกโมดูล</option>
                            {modules.map((mod) => (
                                <option key={mod._id} value={mod._id}>
                                    {mod.module_name}
                                </option>
                            ))}
                        </select>

                        <select
                            className={styles.select}
                            value={newSnippet.type_id}
                            onChange={(e) => setNewSnippet({ ...newSnippet, type_id: e.target.value })}
                            disabled={!newSnippet.module_id}
                        >
                            <option value="">เลือกประเภท</option>
                            {filteredTypes.map((type) => (
                                <option key={type._id} value={type._id}>
                                    {type.type_name}
                                </option>
                            ))}
                        </select>

                        <select
                            className={styles.select}
                            value={newSnippet.difficulty_id}
                            onChange={(e) => setNewSnippet({ ...newSnippet, difficulty_id: e.target.value })}
                        >
                            <option value="">เลือกระดับความยาก</option>
                            {difficulties.map((difficulty) => (
                                <option key={difficulty._id} value={difficulty._id}>
                                    {difficulty.difficult_level}
                                </option>
                            ))}
                        </select>

                        <textarea
                            className={styles.textarea}
                            placeholder="โค้ด"
                            value={newSnippet.snippet_text}
                            onChange={(e) => setNewSnippet({ ...newSnippet, snippet_text: e.target.value })}
                            onKeyDown={handleKeyDown}
                        />

                        <textarea
                            className={styles.textarea}
                            placeholder="ผลลัพธ์ที่คาดหวัง"
                            value={newSnippet.result}
                            onChange={(e) => setNewSnippet({ ...newSnippet, result: e.target.value })}
                        />

                        <button className={styles.button} onClick={addSnippet}>เพิ่มโค้ด</button>
                    </div>
                </div>

                {/* Table showing snippets */}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ภาษา</th>
                            <th>โมดูล</th>
                            <th>ประเภท</th>
                            <th>ระดับความยาก</th>
                            <th>โค้ด</th>
                            <th>ผลลัพธ์</th>
                            <th>การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSnippets.map((snippet, index) => (
                            <tr key={snippet._id}>
                                <td>{snippet.language_id?.language_name}</td>
                                <td>{snippet.module_id?.module_name}</td>
                                <td>{snippet.type_id?.type_name}</td>
                                <td>{snippet.difficulty_id?.difficult_level}</td>
                                <td><pre>{snippet.snippet_text}</pre></td>
                                <td>{snippet.result}</td>
                                <td>
                                    <button onClick={() => openEditModal(snippet._id)} >แก้ไข</button>
                                    <button className={styles.button} onClick={() => deleteSnippet(snippet._id)}>ลบ</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isEditModalOpen && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>แก้ไขโค้ดและผลลัพธ์</h2>

                            <textarea
                                className={styles.textarea}
                                placeholder="โค้ด"
                                value={editingSnippet.snippet_text}
                                onChange={(e) => setEditingSnippet({ ...editingSnippet, snippet_text: e.target.value })}
                                onKeyDown={handleKeyDown}
                            />

                            <textarea
                                className={styles.textarea}
                                placeholder="ผลลัพธ์"
                                value={editingSnippet.result}
                                onChange={(e) => setEditingSnippet({ ...editingSnippet, result: e.target.value })}
                            />

                            <button className={styles.button} onClick={updateSnippet}>บันทึก</button>
                            <button className={styles.button} onClick={closeEditModal}>ยกเลิก</button>
                        </div>
                    </div>
                )}


                {/* Pagination controls */}
                <div className={styles.pagination}>
                    {renderPageNumbers()}
                </div>


                {/* Display results info */}
                <p className={styles.resultsInfo}>
                    {${indexOfFirstSnippet + 1}-${Math.min(indexOfLastSnippet, snippets.length)} of ${snippets.length} results}
                </p>
            </div>
            <style>
                {
                .pageContainer {
                    width: 100%;
                    display: flex; 
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                }
            </style>
        </div>
    );
};

export default CodeSnippetManagement;