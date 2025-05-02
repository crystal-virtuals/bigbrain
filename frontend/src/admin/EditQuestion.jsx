import { EditQuestionForm } from '@/game';
import { FormAlert } from '@components/form';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

function EditQuestion() {
  const [errors, setErrors] = useState(new Map());
  const { question, updateQuestion } = useOutletContext();

  return (
    <>
      {/* Form errors */}
      {errors.size > 0 && (
        <FormAlert errors={errors}>
          <ul role="list" className="list-disc space-y-1 pl-5">
            {Array.from(errors).map(([key, value]) => (
              <li key={key}>{value}</li>
            ))}
          </ul>
        </FormAlert>
      )}

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
