--
-- PostgreSQL database dump
--

\restrict ERgB0MnGMpgiebfLZxO1IAnxxBAmZCnLJeCiO4asofvBI5niavXgWrjX9GXa8zI

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.0

-- Started on 2026-02-05 19:50:01

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 16504)
-- Name: attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    student_id integer NOT NULL,
    session_id integer NOT NULL,
    status character varying(20) NOT NULL,
    CONSTRAINT attendance_status_check CHECK (((status)::text = ANY ((ARRAY['present'::character varying, 'absent'::character varying, 'late'::character varying, 'excused'::character varying])::text[])))
);


ALTER TABLE public.attendance OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16503)
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_id_seq OWNER TO postgres;

--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 231
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- TOC entry 230 (class 1259 OID 16486)
-- Name: class_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.class_sessions (
    id integer NOT NULL,
    course_group_id integer NOT NULL,
    session_date date NOT NULL,
    session_number integer NOT NULL
);


ALTER TABLE public.class_sessions OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16485)
-- Name: class_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.class_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.class_sessions_id_seq OWNER TO postgres;

--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 229
-- Name: class_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.class_sessions_id_seq OWNED BY public.class_sessions.id;


--
-- TOC entry 226 (class 1259 OID 16442)
-- Name: course_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_groups (
    id integer NOT NULL,
    course_id integer NOT NULL,
    professor_id integer NOT NULL,
    semester character varying(20) NOT NULL,
    group_number integer NOT NULL
);


ALTER TABLE public.course_groups OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16441)
-- Name: course_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_groups_id_seq OWNER TO postgres;

--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 225
-- Name: course_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_groups_id_seq OWNED BY public.course_groups.id;


--
-- TOC entry 224 (class 1259 OID 16429)
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    course_code character varying(20) NOT NULL,
    course_name character varying(100) NOT NULL,
    credits integer NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16428)
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO postgres;

--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 223
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- TOC entry 228 (class 1259 OID 16464)
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollments (
    id integer NOT NULL,
    student_id integer NOT NULL,
    course_group_id integer NOT NULL
);


ALTER TABLE public.enrollments OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16463)
-- Name: enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enrollments_id_seq OWNER TO postgres;

--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 227
-- Name: enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.enrollments_id_seq OWNED BY public.enrollments.id;


--
-- TOC entry 222 (class 1259 OID 16417)
-- Name: professors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professors (
    id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(100)
);


ALTER TABLE public.professors OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16416)
-- Name: professors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.professors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.professors_id_seq OWNER TO postgres;

--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 221
-- Name: professors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.professors_id_seq OWNED BY public.professors.id;


--
-- TOC entry 220 (class 1259 OID 16403)
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id integer NOT NULL,
    student_number character varying(20) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    major character varying(100),
    status character varying(20) DEFAULT 'active'::character varying
);


ALTER TABLE public.students OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16402)
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO postgres;

--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 219
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- TOC entry 4846 (class 2604 OID 16507)
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- TOC entry 4845 (class 2604 OID 16489)
-- Name: class_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_sessions ALTER COLUMN id SET DEFAULT nextval('public.class_sessions_id_seq'::regclass);


--
-- TOC entry 4843 (class 2604 OID 16445)
-- Name: course_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_groups ALTER COLUMN id SET DEFAULT nextval('public.course_groups_id_seq'::regclass);


--
-- TOC entry 4842 (class 2604 OID 16432)
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- TOC entry 4844 (class 2604 OID 16467)
-- Name: enrollments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments ALTER COLUMN id SET DEFAULT nextval('public.enrollments_id_seq'::regclass);


--
-- TOC entry 4841 (class 2604 OID 16420)
-- Name: professors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professors ALTER COLUMN id SET DEFAULT nextval('public.professors_id_seq'::regclass);


--
-- TOC entry 4839 (class 2604 OID 16406)
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- TOC entry 5041 (class 0 OID 16504)
-- Dependencies: 232
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance (id, student_id, session_id, status) FROM stdin;
\.


--
-- TOC entry 5039 (class 0 OID 16486)
-- Dependencies: 230
-- Data for Name: class_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.class_sessions (id, course_group_id, session_date, session_number) FROM stdin;
\.


--
-- TOC entry 5035 (class 0 OID 16442)
-- Dependencies: 226
-- Data for Name: course_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_groups (id, course_id, professor_id, semester, group_number) FROM stdin;
\.


--
-- TOC entry 5033 (class 0 OID 16429)
-- Dependencies: 224
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, course_code, course_name, credits) FROM stdin;
\.


--
-- TOC entry 5037 (class 0 OID 16464)
-- Dependencies: 228
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (id, student_id, course_group_id) FROM stdin;
\.


--
-- TOC entry 5031 (class 0 OID 16417)
-- Dependencies: 222
-- Data for Name: professors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professors (id, first_name, last_name, email) FROM stdin;
\.


--
-- TOC entry 5029 (class 0 OID 16403)
-- Dependencies: 220
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, student_number, first_name, last_name, major, status) FROM stdin;
\.


--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 231
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_id_seq', 1, false);


--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 229
-- Name: class_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.class_sessions_id_seq', 1, false);


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 225
-- Name: course_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_groups_id_seq', 1, false);


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 223
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_id_seq', 1, false);


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 227
-- Name: enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enrollments_id_seq', 1, false);


--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 221
-- Name: professors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.professors_id_seq', 1, false);


--
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 219
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 1, false);


--
-- TOC entry 4871 (class 2606 OID 16514)
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- TOC entry 4867 (class 2606 OID 16495)
-- Name: class_sessions class_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT class_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4861 (class 2606 OID 16452)
-- Name: course_groups course_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_groups
    ADD CONSTRAINT course_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 4857 (class 2606 OID 16440)
-- Name: courses courses_course_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_course_code_key UNIQUE (course_code);


--
-- TOC entry 4859 (class 2606 OID 16438)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 4863 (class 2606 OID 16472)
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 4853 (class 2606 OID 16427)
-- Name: professors professors_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professors
    ADD CONSTRAINT professors_email_key UNIQUE (email);


--
-- TOC entry 4855 (class 2606 OID 16425)
-- Name: professors professors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professors
    ADD CONSTRAINT professors_pkey PRIMARY KEY (id);


--
-- TOC entry 4849 (class 2606 OID 16413)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- TOC entry 4851 (class 2606 OID 16415)
-- Name: students students_student_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_student_number_key UNIQUE (student_number);


--
-- TOC entry 4873 (class 2606 OID 16516)
-- Name: attendance unique_attendance; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT unique_attendance UNIQUE (student_id, session_id);


--
-- TOC entry 4865 (class 2606 OID 16474)
-- Name: enrollments unique_enrollment; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT unique_enrollment UNIQUE (student_id, course_group_id);


--
-- TOC entry 4869 (class 2606 OID 16497)
-- Name: class_sessions unique_session; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT unique_session UNIQUE (course_group_id, session_number);


--
-- TOC entry 4879 (class 2606 OID 16522)
-- Name: attendance fk_att_session; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT fk_att_session FOREIGN KEY (session_id) REFERENCES public.class_sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4880 (class 2606 OID 16517)
-- Name: attendance fk_att_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT fk_att_student FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- TOC entry 4874 (class 2606 OID 16453)
-- Name: course_groups fk_course; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_groups
    ADD CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- TOC entry 4876 (class 2606 OID 16480)
-- Name: enrollments fk_course_group; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT fk_course_group FOREIGN KEY (course_group_id) REFERENCES public.course_groups(id) ON DELETE CASCADE;


--
-- TOC entry 4878 (class 2606 OID 16498)
-- Name: class_sessions fk_course_group_session; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_sessions
    ADD CONSTRAINT fk_course_group_session FOREIGN KEY (course_group_id) REFERENCES public.course_groups(id) ON DELETE CASCADE;


--
-- TOC entry 4875 (class 2606 OID 16458)
-- Name: course_groups fk_professor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_groups
    ADD CONSTRAINT fk_professor FOREIGN KEY (professor_id) REFERENCES public.professors(id) ON DELETE CASCADE;


--
-- TOC entry 4877 (class 2606 OID 16475)
-- Name: enrollments fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


-- Completed on 2026-02-05 19:50:02

--
-- PostgreSQL database dump complete
--

\unrestrict ERgB0MnGMpgiebfLZxO1IAnxxBAmZCnLJeCiO4asofvBI5niavXgWrjX9GXa8zI

