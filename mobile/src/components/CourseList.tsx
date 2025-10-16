import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';

export const CourseList = ({ courses, onEdit, onDelete, onTogglePublish }: any) => (
  <ScrollView>
    {courses?.map((course: any) => (
      <Card key={course.id} style={{ margin: 8 }}>
        <Card.Title title={course.title} subtitle={course.category} />
        <Card.Content>
          <Text>{course.description}</Text>
        </Card.Content>
        <Card.Actions>
          <IconButton icon="pencil" onPress={() => onEdit(course)} />
          <IconButton icon="delete" onPress={() => onDelete(course.id)} />
          <IconButton icon={course.isPublished ? "eye" : "eye-off"} onPress={() => onTogglePublish(course)} />
        </Card.Actions>
      </Card>
    ))}
  </ScrollView>
);
