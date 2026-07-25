import React from 'react';
import styles from '../pages/login.module.css';

const InputField = ({ id, type, label, value, onChange }) => {
  return (
    <div className={styles.inputGroup}>
      <input
        type={type}
        id={id}
        required
        placeholder=" "
        value={value}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default InputField;