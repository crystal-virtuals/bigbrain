import { EditQuestionForm } from '@/game';
import { FormErrors } from '@components/form';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

function EditQuestion() {
  const [errors, setErrors] = useState(new Map());
  const { question, updateQuestion } = useOutletContext();

  return (
    <>
      {/* Form errors */}
      <FormErrors errors={errors} />

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
