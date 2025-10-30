import React, { useState } from 'react';
import './App.css'; // سنقوم بإنشاء هذا الملف للأنماط

/**
 * دالة مساعدة لتحويل الأرقام الغربية (1, 2) إلى شرقية (١، ٢)
 * @param {number | string} number الرقم المراد تحويله
 * @returns {string} الرقم بصيغة عربية شرقية
 */
const convertToEasternArabic = (number) => {
  if (number === null || number === undefined) return '';
  // نستخدم toLocaleString مع 'ar-EG' (العربية - مصر) لأنها تستخدم الأرقام الشرقية
  return Number(number).toLocaleString('ar-EG');
};

/**
 * مكون قابل لإعادة الاستخدام لعرض شبكة الأرقام للاختيار
 */
const NumberGrid = ({ title, numbers, selectedNumber, onNumberSelect }) => {
  return (
    <div className="grid-container">
      <h3>{title}</h3>
      <div className="grid">
        {numbers.map((num, index) => (
          <button
            key={index}
            className={`grid-item ${selectedNumber === num ? 'selected' : ''}`}
            onClick={() => onNumberSelect(num)}
          >
            {/* تحويل الرقم للعرض */}
            {convertToEasternArabic(num)}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * المكون الرئيسي للتطبيق
 */
function App() {
  // أرقام الجداول (قيم منطقية)
  const tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const multiplierNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // إدارة الحالة باستخدام Hooks
  const [selectedTable, setSelectedTable] = useState(7); // قيمة افتراضية من الصورة
  const [selectedMultiplier, setSelectedMultiplier] = useState(5); // قيمة افتراضية من الصورة
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(35); // النتيجة الابتدائية من الصورة

  // حساب الإجابة الصحيحة (القيمة المنطقية)
  const correctAnswer = selectedTable * selectedMultiplier;

  // دالة لإعادة تعيين اللعبة عند اختيار رقم جديد
  const resetQuiz = () => {
    setIsSubmitted(false);
    setUserAnswer('');
    setIsCorrect(false);
  };

  // معالج اختيار رقم من الجدول الأول
  const handleTableSelect = (num) => {
    setSelectedTable(num);
    resetQuiz();
  };

  // معالج اختيار رقم من الجدول الثاني
  const handleMultiplierSelect = (num) => {
    setSelectedMultiplier(num);
    resetQuiz();
  };

  // معالج إرسال الإجابة
  const handleSubmit = (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    setIsSubmitted(true);
    // التحقق يتم باستخدام الأرقام العادية
    const answerIsCorrect = parseInt(userAnswer) === correctAnswer;
    setIsCorrect(answerIsCorrect);

    if (answerIsCorrect) {
      setScore(score + 1); // زيادة النقاط إذا كانت الإجابة صحيحة
    }
  };

  return (
    <div className="app-container" dir="rtl">
      <header>
        <h1>تعلّم جدول الضرب</h1>
        <p>(Multiplication Table Design)</p>
      </header>
      
      <main>
        {/* اختيار الجدول */}
        <NumberGrid
          title="اختر الجدول (Select Table)"
          numbers={tableNumbers}
          selectedNumber={selectedTable}
          onNumberSelect={handleTableSelect}
        />
        
        {/* اختيار الرقم المضروب */}
        <NumberGrid
          title="اختر الرقم المضروب (Select Multiplier)"
          numbers={multiplierNumbers}
          selectedNumber={selectedMultiplier}
          onNumberSelect={handleMultiplierSelect}
        />

        {/* شاشة عرض العملية */}
        <div className="display-screen">
          {/* تحويل الأرقام للعرض */}
          {convertToEasternArabic(selectedTable)} x {convertToEasternArabic(selectedMultiplier)}
        </div>

        {/* نموذج الإجابة */}
        <form className="answer-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="userAnswer">إجابتك (Your Answer)</label>
            <input
              type="number" // نستخدم type="number" لضمان إدخال أرقام فقط
              id="userAnswer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isSubmitted} 
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="correctAnswer">الإجابة الصحيحة (Correct Answer)</label>
            <input
              type="text" // نستخدم text هنا لنتمكن من عرض الأرقام العربية
              id="correctAnswer"
              value={isSubmitted ? convertToEasternArabic(correctAnswer) : ''} 
              disabled 
            />
          </div>
          
          <button type="submit" className="show-button">إظهار النتيجة (Show)</button>
        </form>

        {/* عرض النتيجة والنقاط */}
        {isSubmitted && (
          <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? (
              <span>✅ أحسنت! الإجابة صحيحة.</span>
            ) : (
              // تحويل الرقم للعرض
              <span>❌ للأسف. الإجابة الصحيحة هي {convertToEasternArabic(correctAnswer)}.</span>
            )}
          </div>
        )}

 
      </main>

      {/* الفوتر */}
      <footer>
        <p>Copyright © 2024 جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}

export default App;