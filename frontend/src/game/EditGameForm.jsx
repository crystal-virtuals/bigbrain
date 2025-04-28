import { Field, Label } from '@components/fieldset';
import { EditForm, useEditForm } from '@hooks/form';
import { FileInput, TextInput } from '@components/form';
import { isNullOrUndefined } from '@utils/helpers';
import { Skeleton } from '@components/loading';
import { mapToGame } from '../shared/utils/game';

const validate = (game) => {
  if (!game.name || game.name.trim() === '') {
    return 'Game name is required';
  }
  return null;
}

function EditGameForm({ game, onSubmit, isReadOnly = false }) {
  const props = useEditForm(mapToGame(game), onSubmit, validate, isReadOnly);
  const { formData, setFormData, ...rest } = props;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Make sure game and formData has been set
  if (isNullOrUndefined(formData)) {
    return <Skeleton className="col-span-full max-w-2xl" />;
  }

  return (
    <>
      <EditForm {...rest}>
        {/* Game name */}
        <Field className="col-span-full">
          <Label htmlFor="gameName">Game name</Label>
          <TextInput
            id="gameName"
            name="name"
            value={formData.name}
            onChange={(value) => handleChange('name', value)}
            readOnly={props.readOnly}
            disabled={props.disabled}
          />
        </Field>

        {/* Game thumbnail */}
        <Field className="col-span-full">
          <Label htmlFor="thumbnail">Photo</Label>
          <FileInput
            name="thumbnail"
            value={formData.thumbnail}
            onChange={(dataUrl) => handleChange('thumbnail', dataUrl)}
            readOnly={props.readOnly}
            disabled={props.disabled}
          />
        </Field>
      </EditForm>
    </>
  );
}

export default EditGameForm;