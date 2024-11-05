import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Sidebar = ({ selectedLanguage, selectedType, onLanguageSelect, onTypeSelect }) => {
  const [languages, setLanguages] = useState([]);
  const [types, setTypes] = useState([]);
  const [modules, setModules] = useState([]);
  // console.log('selectedLanguage:', selectedLanguage);
  // console.log('selectedType:', selectedType);

  useEffect(() => {
    fetchLanguages();
    fetchModules();
    fetchTypes();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await axios.get('http://localhost:3005/user/fetch/languages');
      setLanguages(response.data);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลภาษา:', error);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await axios.get('http://localhost:3005/user/fetch/types');
      setTypes(response.data);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลประเภท:', error);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await axios.get('http://localhost:3005/user/fetch/modules');
      setModules(response.data);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลโมดูล:', error);
    }
  };

  return (
    <div className="sidebar">
  <style>
    {`
    
      .sidebar {
        width: 200px;
        height: 100vh; /* เต็มความสูงของหน้าจอ */
        padding: 20px;
        background-color: #023859;
        border-right: 1px solid #ccc;
        margin-top: 55px;
        overflow-y: auto; /* เพิ่มการ scroll เมื่อเนื้อหามีขนาดใหญ่เกิน */
      }

      .sidebar h2 {
        margin-top: 0;
        color: #BF7AA0;
      }

      .sidebar h3 {
        color: #BF7AA0;
      }

      .sidebar ul {
        list-style-type: none;
        padding: 0;
        color: #F2D8E1;
      }

      .sidebar li {
        padding: 10px;
        cursor: pointer;
        background-color: ${selectedType ? '#d3e0ff' : 'transparent'};
      }

      .sidebar li:hover {
        background-color: #025373;
      }
    `}
  </style>

  <h2>Languages</h2>
  <ul>
    {languages.length > 0 ? (
      languages.map((language) => (
        <li 
          key={language._id} 
          onClick={() => onLanguageSelect(language)}
          style={{ 
            fontWeight: selectedLanguage && selectedLanguage._id === language._id ? 'bold' : 'normal', 
            backgroundColor: selectedLanguage && selectedLanguage._id === language._id ? '#025373' : 'transparent' 
          }}
        >
          {language.language_name}
        </li>
      ))
    ) : (
      <li>ไม่มีภาษาให้แสดง</li>
    )}
  </ul>

  <h2>Types</h2>
  {modules.length > 0 ? (
    modules.map((module) => (
      <div key={module._id}>
        <h3>{module.module_name}</h3>
        <ul>
          {types.length > 0 ? (
            types
              .filter(type => type.module_id._id === module._id)
              .map((filteredType) => (
                <li 
                  key={filteredType._id} 
                  onClick={() => onTypeSelect(filteredType)}
                  style={{ 
                    fontWeight: selectedType && selectedType._id === filteredType._id ? 'bold' : 'normal', 
                    backgroundColor: selectedType && selectedType._id === filteredType._id ? '#025373' : 'transparent' 
                  }}
                >
                  {filteredType.type_name}
                </li>
              ))
          ) : (
            <li>ไม่มีประเภทให้แสดง</li>
          )}
        </ul>
      </div>
    ))
  ) : (
    <div>ไม่มีโมดูลให้แสดง</div>
  )}
</div>

  );
};

export default Sidebar;
