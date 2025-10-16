import React from 'react';
import { View } from 'react-native';
import { QuestionCard } from './QuestionCard';
import { styles } from '../styles';

type QuestionsListProps = {
  questions: any[];
  onEdit: (question: any) => void;
  onDelete: (id: string, text: string) => void;
};

export const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.questionsList}>
      {questions.map((question: any, index: number) => (
        <QuestionCard
          key={question.id}
          question={question}
          index={index}
          onEdit={() => onEdit(question)}
          onDelete={() => onDelete(question.id, question.question)}
        />
      ))}
    </View>
  );
};
