import React, { memo, useCallback, useState, useEffect } from 'react';
import { View } from 'react-native';
import { LightCourseCard } from './LightCourseCard';
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
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    // Reset to 8 when courses change
    setVisibleCount(8);
    
    // Load remaining courses progressively
    if (courses.length > 8) {
      const timer = setTimeout(() => {
        requestAnimationFrame(() => {
          setVisibleCount(courses.length);
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [courses.length]);

  const visibleCourses = courses.slice(0, visibleCount);

  return (
    <View style={styles.coursesList}>
      {visibleCourses.map((course: any) => (
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
    <LightCourseCard
      course={course}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onTogglePublish={handleTogglePublish}
    />
  );
};

const MemoizedCourseItem = memo(CourseItem);

export const CoursesList = memo(CoursesListComponent);
