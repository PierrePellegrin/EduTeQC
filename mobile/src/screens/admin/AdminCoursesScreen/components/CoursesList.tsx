import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { CourseCard } from './CourseCard';
import { styles } from '../styles';

type CoursesListProps = {
  courses: any[];
  onEdit: (course: any) => void;
  onDelete: (id: string, title: string) => void;
  onTogglePublish: (id: string, currentStatus: boolean, title: string) => void;
};

const CoursesListComponent: React.FC<CoursesListProps> = ({
  courses,
  onEdit,
  onDelete,
  onTogglePublish,
}) => {
  return (
    <View style={styles.coursesList}>
      {courses.map((course: any) => (
        <MemoizedCourseItem
          key={course.id}
          course={course}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
        />
      ))}
    </View>
  );
};

type CourseItemProps = {
  course: any;
  onEdit: (course: any) => void;
  onDelete: (id: string, title: string) => void;
  onTogglePublish: (id: string, currentStatus: boolean, title: string) => void;
};

const CourseItem: React.FC<CourseItemProps> = ({ course, onEdit, onDelete, onTogglePublish }) => {
  const handleEdit = useCallback(() => onEdit(course), [course, onEdit]);
  const handleDelete = useCallback(() => onDelete(course.id, course.title), [course.id, course.title, onDelete]);
  const handleTogglePublish = useCallback(() => onTogglePublish(course.id, course.isPublished, course.title), [course.id, course.isPublished, course.title, onTogglePublish]);

  return (
    <CourseCard
      course={course}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onTogglePublish={handleTogglePublish}
    />
  );
};

const MemoizedCourseItem = memo(CourseItem);

export const CoursesList = memo(CoursesListComponent);
