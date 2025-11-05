# Backups

Ce dossier contient les sauvegardes de la base de données et autres fichiers de backup du projet.

## Fichiers de Backup

- **backup_avant_migration_20251022.sql** - Backup de la base de données avant la migration du 22 octobre 2025

## Recommandations

- Garder les backups récents (moins de 6 mois)
- Archiver les anciens backups ailleurs si nécessaire
- Toujours faire un backup avant des modifications importantes de la BDD
- Les backups contiennent des données sensibles - ne pas les commiter dans Git

## Utilisation

Pour restaurer un backup :
```sql
-- Se connecter à PostgreSQL
psql -h localhost -U username -d database_name

-- Restaurer le backup
\i backup_avant_migration_20251022.sql
```

Ou avec pg_restore si c'est un backup binaire :
```bash
pg_restore -h localhost -U username -d database_name backup_file
```