import { FormErrors } from '@components/form';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import EditQuestionForm from './EditQuestionForm';

function EditQuestion() {
  const [errors, setErrors] = useState(new Map());
  const { question, updateQuestion } = useOutletContext();

  return (
    <>
      {/* Form errors */}
      <div className="col-span-full">
        <FormErrors errors={errors} className='' />
      </div>

      {/* Question Form */}
      <EditQuestionForm
        question={question}
        errors={errors}
        setErrors={setErrors}
        onSubmit={updateQuestion}
        isReadOnly={false}
      />
    </>
  );
}

export default EditQuestion;
