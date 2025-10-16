import React from 'react';
import { View } from 'react-native';
import { CourseCard } from './CourseCard';
import { styles } from '../styles';

type CoursesListProps = {
  courses: any[];
  onEdit: (course: any) => void;
  onDelete: (id: string, title: string) => void;
  onTogglePublish: (id: string, currentStatus: boolean, title: string) => void;
};

export const CoursesList: React.FC<CoursesListProps> = ({
  courses,
  onEdit,
  onDelete,
  onTogglePublish,
}) => {
  return (
    <View style={styles.coursesList}>
      {courses.map((course: any) => (
        <CourseCard
          key={course.id}
          course={course}
          onEdit={() => onEdit(course)}
          onDelete={() => onDelete(course.id, course.title)}
          onTogglePublish={() => onTogglePublish(course.id, course.isPublished, course.title)}
        />
      ))}
    </View>
  );
};
