import mcIcon from '@assets/multiple-choice.svg';
import scIcon from '@assets/single-choice.svg';
import tfIcon from '@assets/true-false.png';
import { Button } from '@components/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog';
import { Heading } from '@components/heading';
import { Text } from '@components/text';
import { questionTypes } from '@constants/questions';
import clsx from 'clsx';
import { useToast } from '@hooks/toast';

const styles = {
  default: [
    // Cursor
    'cursor-pointer touch-manipulation pointer-events-auto',
  ],
  questionType: [
    // Base
    'bg-zinc-400/10 dark:bg-white/10 flex flex-row gap-4 py-2 px-4 md:py-4 rounded-lg mx-0 w-full items-center',
    // Hover
    'hover:bg-zinc-400/20 dark:hover:bg-white/20  ',
  ]
}

const buttonItems = [
  {
    title: 'Single Choice',
    description: 'One correct answer',
    icon: scIcon,
    type: questionTypes.SINGLE_CHOICE,
  },
  {
    title: 'Multiple Choice',
    description: 'Multiple correct answers',
    icon: mcIcon,
    type: questionTypes.MULTIPLE_CHOICE,
  },
  {
    title: 'Judgement',
    description: 'One answer, either true or false',
    icon: tfIcon,
    type: questionTypes.JUDGEMENT,
  },
]

function QuestionTypeOption({ title, description, icon, onClick, ...props }) {
  return (
    <div>
      <button type="button" onClick={onClick} className={clsx(styles.questionType, styles.default)} {...props}>
        <div className="relative w-14 h-14 md:w-20 md:h-20 overflow-hidden bg-white/10 rounded-full">
          <img src={icon} alt={title} className="absolute inset-0 object-cover w-full h-full" />
        </div>
        <div className="flex flex-col items-start justify-center flex-1">
          <div className="w-full text-left">
            <div className="flex flex-row justify-start gap-2">
              <Heading className="text-white">{title}</Heading>
            </div>
            <Text className="text-base font-normal text-white/70 leading-none md:leading-normal">{description}</Text>
          </div>
        </div>
      </button>
    </div>
  )
}



export default function NewQuestionModal({ isOpen, setIsOpen, createQuestion }) {
  const toastify = useToast();

  const handleClick = (questionType) => {
    createQuestion(questionType)
      .then(() => {
        toastify.success('Question created');
      })
      .catch(() => {
        toastify.error('Failed to create question. Please try again later.');
      })
      .finally(() => {
        setIsOpen(false);
      });
  }

  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <DialogTitle>Add Question</DialogTitle>
      <DialogDescription>
        Select the type of question you want to add.
      </DialogDescription>
      <DialogBody>
        <div className="flex flex-col gap-4">
          {buttonItems.map((item) => (
            <div key={item.title} className="flex flex-col">
              <QuestionTypeOption
                title={item.title}
                description={item.description}
                icon={item.icon}
                onClick={() => handleClick(item.type)}
              />
            </div>
          ))}
        </div>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
