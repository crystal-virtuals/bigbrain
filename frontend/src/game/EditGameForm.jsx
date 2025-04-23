import { Card } from '@components/card';
import { Field, Label } from '@components/fieldset';
import { EditForm, useEditForm } from '@hooks/form';
import { FileInput, TextInput } from '@components/form';
import { isNullOrUndefined } from '@utils/helpers';
import { Skeleton } from '@components/loading';

function EditGameForm({ game, onSubmit }) {
  const props = useEditForm(game, onSubmit);
  const { formData, setFormData, ...rest } = props;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Make sure game and formData has been set
  if (isNullOrUndefined(formData)) {
    return (
      <Card>
        <Skeleton className="col-span-full max-w-2xl" />
      </Card>
    );
  }

  return (
    <>
      <Card>
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
      </Card>
    </>
  );
}

export default EditGameForm;