import React, { useState } from 'react';
import './App.css'; // سنقوم بإنشاء هذا الملف للأنماط

/**
 * دالة مساعدة لتحويل الأرقام الغربية (1, 2) إلى شرقية (١، ٢)
 * @param {number | string} number الرقم المراد تحويله
 * @returns {string} الرقم بصيغة عربية شرقية
 */
const convertToEasternArabic = (number) => {
  if (number === null || number === undefined || number === '') return '';
  // نستخدم toLocaleString مع 'ar-EG' (العربية - مصر) لأنها تستخدم الأرقام الشرقية
  return Number(number).toLocaleString('ar-EG');
};

/**
 * --- دالة جديدة: لتحويل الأرقام الشرقية (١) إلى غربية (1) ---
 */
const westernArabicMap = {
  '٠': 0, '١': 1, '٢': 2, '٣': 3, '٤': 4,
  '٥': 5, '٦': 6, '٧': 7, '٨': 8, '٩': 9,
};
const convertToWesternArabic = (numberStr) => {
  if (numberStr === null || numberStr === undefined) return '';
  // نستخدم replace لتحويل أي رقم شرقي إلى غربي
  return String(numberStr).replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => westernArabicMap[d]);
};


/**
 * مكون قابل لإعادة الاستخدام لعرض شبكة الأرقام للاختيار
 */
const NumberGrid = ({ title, numbers, selectedNumber, onNumberSelect }) => {
  // ... (الكود هنا لم يتغير)
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
  const [selectedTable, setSelectedTable] = useState(7); 
  const [selectedMultiplier, setSelectedMultiplier] = useState(5);
  // ملاحظة: userAnswer ستحفظ دائماً الأرقام الغربية (e.g., "50")
  const [userAnswer, setUserAnswer] = useState(''); 
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(35); 

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

  /**
   * --- معالج جديد للتحكم في إدخال الإجابة ---
   */
  const handleAnswerChange = (e) => {
    const rawValue = e.target.value;
    // 1. تحويل أي أرقام شرقية مكتوبة إلى غربية
    let westernValue = convertToWesternArabic(rawValue);
    
    // 2. فلترة أي شيء غير الأرقام الغربية (لضمان أن الحالة نظيفة)
    const numericValue = westernValue.replace(/[^0-9]/g, ''); 
    
    // 3. حفظ القيمة الغربية النظيفة في الحالة
    setUserAnswer(numericValue);
  };

  // معالج إرسال الإجابة
  const handleSubmit = (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    setIsSubmitted(true);
    // التحقق سليم لأن userAnswer مخزن كأرقام غربية
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
        {/* ... (مكونات NumberGrid لم تتغير) ... */}
        <NumberGrid
          title="اختر الجدول (Select Table)"
          numbers={tableNumbers}
          selectedNumber={selectedTable}
          onNumberSelect={handleTableSelect}
        />
        <NumberGrid
          title="اختر الرقم المضروب (Select Multiplier)"
          numbers={multiplierNumbers}
          selectedNumber={selectedMultiplier}
          onNumberSelect={handleMultiplierSelect}
        />

        {/* شاشة عرض العملية */}
        <div className="display-screen">
          {convertToEasternArabic(selectedTable)} x {convertToEasternArabic(selectedMultiplier)}
        </div>

        {/* نموذج الإجابة */}
        <form className="answer-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="userAnswer">إجابتك (Your Answer)</label>
            {/* --- التعديلات هنا --- */}
            <input
              type="text" // 1. تغيير النوع إلى text
              inputMode="numeric" // 2. إضافة لوحة مفاتيح رقمية للهاتف
              pattern="[0-9٠-٩]*" // 3. إضافة نمط للتحقق (يقبل كلا النوعين)
              id="userAnswer"
              // 4. القيمة المعروضة: هي تحويل الحالة (الغربية) إلى شرقية
              value={convertToEasternArabic(userAnswer)} 
              // 5. onChange: استخدام المعالج الجديد
              onChange={handleAnswerChange} 
              disabled={isSubmitted} 
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="correctAnswer">الإجابة الصحيحة (Correct Answer)</label>
            <input
              type="text" 
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
              <span>❌ للأسف. الإجابة الصحيحة هي {convertToEasternArabic(correctAnswer)}.</span>
            )}
          </div>
        )}

        

      </main>

      {/* الفوتر */}
      <footer>
        <p>M.H.T © 2025 جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}

export default App;

