BEGIN;

TRUNCATE TABLE
    public.attendance,
    public.enrollments,
    public.class_sessions,
    public.course_groups,
    public.courses,
    public.professors,
    public.students
RESTART IDENTITY
CASCADE;

ALTER TABLE public.professors
    ADD COLUMN IF NOT EXISTS password character varying(255) NOT NULL DEFAULT 'changeme';

ALTER TABLE public.students
    ADD COLUMN IF NOT EXISTS password character varying(255) NOT NULL DEFAULT 'changeme';

ALTER TABLE public.professors
    ADD COLUMN IF NOT EXISTS photo_url text;

ALTER TABLE public.students
    ADD COLUMN IF NOT EXISTS photo_url text;

INSERT INTO public.professors (id, first_name, last_name, email, password, photo_url) VALUES
    (1, 'رضا', 'کریمی', 'r.karimi@sut.ac.ir', 'prof123', 'https://api.dicebear.com/9.x/initials/svg?seed=Reza%20Karimi'),
    (2, 'لیلا', 'فرهادی', 'l.farhadi@sut.ac.ir', 'prof123', 'https://api.dicebear.com/9.x/initials/svg?seed=Leila%20Farhadi');

INSERT INTO public.courses (id, course_code, course_name, credits) VALUES
    (1, 'CS401', 'پردازش زبان‌های طبیعی', 3),
    (2, 'CS201', 'ساختمان داده', 3),
    (3, 'CS301', 'سیستم‌عامل', 3),
    (4, 'CS302', 'سیستم‌های پایگاه داده', 3);

INSERT INTO public.course_groups (id, course_id, professor_id, semester, group_number) VALUES
    (1, 1, 1, '1404-1', 1),
    (2, 2, 2, '1404-1', 1),
    (3, 3, 1, '1404-1', 1),
    (4, 4, 2, '1404-1', 1);

INSERT INTO public.class_sessions (id, course_group_id, session_date, session_number) VALUES
    (1, 1, '2026-02-01', 1),
    (2, 1, '2026-02-02', 2),
    (3, 1, '2026-02-03', 3),
    (4, 1, '2026-02-04', 4),
    (5, 1, '2026-02-05', 5),
    (6, 1, '2026-02-06', 6),
    (7, 1, '2026-02-07', 7),
    (8, 1, '2026-02-08', 8),
    (9, 2, '2026-02-09', 1),
    (10, 2, '2026-02-10', 2),
    (11, 2, '2026-02-11', 3),
    (12, 2, '2026-02-12', 4),
    (13, 2, '2026-02-13', 5),
    (14, 2, '2026-02-14', 6),
    (15, 3, '2026-02-17', 1),
    (16, 3, '2026-02-18', 2),
    (17, 3, '2026-02-19', 3),
    (18, 3, '2026-02-20', 4),
    (19, 3, '2026-02-21', 5),
    (20, 3, '2026-02-22', 6),
    (21, 4, '2026-02-24', 1),
    (22, 4, '2026-02-25', 2),
    (23, 4, '2026-02-26', 3),
    (24, 4, '2026-02-27', 4),
    (25, 4, '2026-02-28', 5),
    (26, 4, '2026-03-01', 6);

INSERT INTO public.students (id, student_number, first_name, last_name, major, status, password, photo_url) VALUES
    (1, '4001', 'علی', 'احمدی', 'مهندسی کامپیوتر', 'active', 'stu123', 'https://api.dicebear.com/9.x/initials/svg?seed=Ali%20Ahmadi'),
    (2, '4002', 'سارا', 'کریمی', 'مهندسی کامپیوتر', 'active', 'stu123', 'https://api.dicebear.com/9.x/initials/svg?seed=Sara%20Karimi'),
    (3, '4003', 'رضا', 'موسوی', 'مهندسی کامپیوتر', 'active', 'stu123', 'https://api.dicebear.com/9.x/initials/svg?seed=Reza%20Mousavi'),
    (4, '4004', 'مینا', 'حسینی', 'مهندسی کامپیوتر', 'active', 'stu123', 'https://api.dicebear.com/9.x/initials/svg?seed=Mina%20Hosseini'),
    (5, '4005', 'هادی', 'رحیمی', 'مهندسی کامپیوتر', 'active', 'stu123', 'https://api.dicebear.com/9.x/initials/svg?seed=Hadi%20Rahimi'),
    (6, '4006', 'ندا', 'اکبری', 'مهندسی کامپیوتر', 'active', 'stu123', 'https://api.dicebear.com/9.x/initials/svg?seed=Neda%20Akbari'),
    (7, '4007', 'امیر', 'ابراهیمی', 'مهندسی کامپیوتر', 'active', 'stu123', 'https://api.dicebear.com/9.x/initials/svg?seed=Amir%20Ebrahimi'),
    (8, '4008', 'لیلا', 'مرادی', 'مهندسی کامپیوتر', 'active', 'stu123', 'https://api.dicebear.com/9.x/initials/svg?seed=Leyla%20Moradi'),
    (9, '4009', 'سعید', 'جعفری', 'مهندسی کامپیوتر', 'active', 'stu123', 'https://api.dicebear.com/9.x/initials/svg?seed=Saeed%20Jafari'),
    (10, '4010', 'مریم', 'نوری', 'مهندسی کامپیوتر', 'active', 'stu123', 'https://api.dicebear.com/9.x/initials/svg?seed=Maryam%20Nouri');

INSERT INTO public.enrollments (id, student_id, course_group_id) VALUES
    (1, 1, 1),
    (2, 2, 1),
    (3, 3, 1),
    (4, 4, 1),
    (5, 5, 1),
    (6, 6, 1),
    (7, 7, 1),
    (8, 8, 1),
    (9, 9, 1),
    (10, 10, 1),
    (11, 1, 2),
    (12, 1, 3),
    (13, 1, 4),
    (14, 2, 2),
    (15, 2, 3),
    (16, 3, 2),
    (17, 4, 3),
    (18, 5, 4),
    (19, 6, 4),
    (20, 7, 2);

INSERT INTO public.attendance (id, student_id, session_id, status) VALUES
    (1, 1, 1, 'present'),
    (2, 2, 1, 'present'),
    (3, 3, 1, 'late'),
    (4, 4, 1, 'present'),
    (5, 5, 1, 'absent'),
    (6, 6, 1, 'present'),
    (7, 7, 1, 'present'),
    (8, 8, 1, 'present'),
    (9, 9, 1, 'present'),
    (10, 10, 1, 'excused'),
    (11, 1, 2, 'present'),
    (12, 2, 2, 'present'),
    (13, 3, 2, 'present'),
    (14, 4, 2, 'late'),
    (15, 5, 2, 'present'),
    (16, 6, 2, 'present'),
    (17, 7, 2, 'present'),
    (18, 8, 2, 'absent'),
    (19, 9, 2, 'present'),
    (20, 10, 2, 'present'),
    (21, 1, 3, 'present'),
    (22, 2, 3, 'present'),
    (23, 3, 3, 'present'),
    (24, 4, 3, 'present'),
    (25, 5, 3, 'late'),
    (26, 6, 3, 'present'),
    (27, 7, 3, 'present'),
    (28, 8, 3, 'present'),
    (29, 9, 3, 'absent'),
    (30, 10, 3, 'present'),
    (31, 1, 4, 'present'),
    (32, 2, 4, 'excused'),
    (33, 3, 4, 'present'),
    (34, 4, 4, 'present'),
    (35, 5, 4, 'present'),
    (36, 6, 4, 'present'),
    (37, 7, 4, 'present'),
    (38, 8, 4, 'late'),
    (39, 9, 4, 'present'),
    (40, 10, 4, 'present'),
    (41, 1, 5, 'present'),
    (42, 2, 5, 'present'),
    (43, 3, 5, 'present'),
    (44, 4, 5, 'present'),
    (45, 5, 5, 'present'),
    (46, 6, 5, 'absent'),
    (47, 7, 5, 'present'),
    (48, 8, 5, 'present'),
    (49, 9, 5, 'late'),
    (50, 10, 5, 'present'),
    (51, 1, 6, 'present'),
    (52, 2, 6, 'present'),
    (53, 3, 6, 'present'),
    (54, 4, 6, 'present'),
    (55, 5, 6, 'present'),
    (56, 6, 6, 'present'),
    (57, 7, 6, 'present'),
    (58, 8, 6, 'present'),
    (59, 9, 6, 'present'),
    (60, 10, 6, 'present'),
    (61, 1, 7, 'late'),
    (62, 2, 7, 'present'),
    (63, 3, 7, 'present'),
    (64, 4, 7, 'present'),
    (65, 5, 7, 'present'),
    (66, 6, 7, 'present'),
    (67, 7, 7, 'present'),
    (68, 8, 7, 'present'),
    (69, 9, 7, 'present'),
    (70, 10, 7, 'present'),
    (71, 1, 8, 'present'),
    (72, 2, 8, 'present'),
    (73, 3, 8, 'present'),
    (74, 4, 8, 'present'),
    (75, 5, 8, 'present'),
    (76, 6, 8, 'present'),
    (77, 7, 8, 'excused'),
    (78, 8, 8, 'present'),
    (79, 9, 8, 'present'),
    (80, 10, 8, 'present'),
    (81, 1, 9, 'present'),
    (82, 1, 10, 'present'),
    (83, 1, 11, 'late'),
    (84, 1, 12, 'present'),
    (85, 1, 13, 'absent'),
    (86, 1, 14, 'present'),
    (87, 1, 15, 'present'),
    (88, 1, 16, 'late'),
    (89, 1, 17, 'present'),
    (90, 1, 18, 'present'),
    (91, 1, 19, 'present'),
    (92, 1, 20, 'present'),
    (93, 1, 21, 'present'),
    (94, 1, 22, 'absent'),
    (95, 1, 23, 'present'),
    (96, 1, 24, 'late'),
    (97, 1, 25, 'present'),
    (98, 1, 26, 'present'),
    (99, 2, 9, 'present'),
    (100, 2, 10, 'present'),
    (101, 2, 11, 'present'),
    (102, 2, 12, 'absent'),
    (103, 2, 13, 'present'),
    (104, 2, 14, 'present');

SELECT pg_catalog.setval('public.professors_id_seq', 2, true);
SELECT pg_catalog.setval('public.courses_id_seq', 4, true);
SELECT pg_catalog.setval('public.course_groups_id_seq', 4, true);
SELECT pg_catalog.setval('public.class_sessions_id_seq', 26, true);
SELECT pg_catalog.setval('public.students_id_seq', 10, true);
SELECT pg_catalog.setval('public.enrollments_id_seq', 20, true);
SELECT pg_catalog.setval('public.attendance_id_seq', 104, true);

COMMIT;
