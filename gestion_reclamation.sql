--
-- PostgreSQL database dump
--

\restrict LzI8uxAXF4W2rEvsvDLfLjObrf1HNCHLb0Wdijj5kUqfAXt6yS6bsDC5gyKKVOE

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-01 11:40:22

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16815)
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    telephone character varying(20),
    email character varying(150),
    adresse text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16814)
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clients_id_seq OWNER TO postgres;

--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 221
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- TOC entry 228 (class 1259 OID 16878)
-- Name: historique_reclamations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historique_reclamations (
    id integer NOT NULL,
    reclamation_id integer NOT NULL,
    ancien_statut character varying(30),
    nouveau_statut character varying(30),
    user_id integer,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.historique_reclamations OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16877)
-- Name: historique_reclamations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historique_reclamations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historique_reclamations_id_seq OWNER TO postgres;

--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 227
-- Name: historique_reclamations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historique_reclamations_id_seq OWNED BY public.historique_reclamations.id;


--
-- TOC entry 230 (class 1259 OID 16899)
-- Name: historique_statuts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historique_statuts (
    id integer NOT NULL,
    reclamation_id integer NOT NULL,
    ancien_statut character varying(20),
    nouveau_statut character varying(20),
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.historique_statuts OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16898)
-- Name: historique_statuts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historique_statuts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historique_statuts_id_seq OWNER TO postgres;

--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 229
-- Name: historique_statuts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historique_statuts_id_seq OWNED BY public.historique_statuts.id;


--
-- TOC entry 224 (class 1259 OID 16828)
-- Name: reclamations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reclamations (
    id integer NOT NULL,
    client_id integer NOT NULL,
    sujet character varying(255) NOT NULL,
    description text NOT NULL,
    statut character varying(30) DEFAULT 'En attente'::character varying,
    priorite character varying(20) DEFAULT 'Moyenne'::character varying,
    assigned_to integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reclamations OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16827)
-- Name: reclamations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reclamations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reclamations_id_seq OWNER TO postgres;

--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 223
-- Name: reclamations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reclamations_id_seq OWNED BY public.reclamations.id;


--
-- TOC entry 226 (class 1259 OID 16854)
-- Name: reponses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reponses (
    id integer NOT NULL,
    reclamation_id integer NOT NULL,
    user_id integer NOT NULL,
    message text NOT NULL,
    date_reponse timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reponses OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16853)
-- Name: reponses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reponses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reponses_id_seq OWNER TO postgres;

--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 225
-- Name: reponses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reponses_id_seq OWNED BY public.reponses.id;


--
-- TOC entry 220 (class 1259 OID 16797)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16796)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4782 (class 2604 OID 16818)
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 16881)
-- Name: historique_reclamations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_reclamations ALTER COLUMN id SET DEFAULT nextval('public.historique_reclamations_id_seq'::regclass);


--
-- TOC entry 4792 (class 2604 OID 16902)
-- Name: historique_statuts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_statuts ALTER COLUMN id SET DEFAULT nextval('public.historique_statuts_id_seq'::regclass);


--
-- TOC entry 4784 (class 2604 OID 16831)
-- Name: reclamations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamations ALTER COLUMN id SET DEFAULT nextval('public.reclamations_id_seq'::regclass);


--
-- TOC entry 4788 (class 2604 OID 16857)
-- Name: reponses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reponses ALTER COLUMN id SET DEFAULT nextval('public.reponses_id_seq'::regclass);


--
-- TOC entry 4780 (class 2604 OID 16800)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4965 (class 0 OID 16815)
-- Dependencies: 222
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, nom, prenom, telephone, email, adresse, created_at) FROM stdin;
\.


--
-- TOC entry 4971 (class 0 OID 16878)
-- Dependencies: 228
-- Data for Name: historique_reclamations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historique_reclamations (id, reclamation_id, ancien_statut, nouveau_statut, user_id, date_modification) FROM stdin;
\.


--
-- TOC entry 4973 (class 0 OID 16899)
-- Dependencies: 230
-- Data for Name: historique_statuts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historique_statuts (id, reclamation_id, ancien_statut, nouveau_statut, date_modification) FROM stdin;
\.


--
-- TOC entry 4967 (class 0 OID 16828)
-- Dependencies: 224
-- Data for Name: reclamations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reclamations (id, client_id, sujet, description, statut, priorite, assigned_to, date_creation) FROM stdin;
\.


--
-- TOC entry 4969 (class 0 OID 16854)
-- Dependencies: 226
-- Data for Name: reponses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reponses (id, reclamation_id, user_id, message, date_reponse) FROM stdin;
\.


--
-- TOC entry 4963 (class 0 OID 16797)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, nom, prenom, email, password, role, created_at) FROM stdin;
4	Admin	Khalid	admin@test.com	$2b$10$Fj35t56DaMkgwv.eWtfmUe3a2e1P2SVkfJ1YukIGg.pEURcpN/mGy	admin	2026-06-04 10:46:46.045446
\.


--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 221
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clients_id_seq', 1, false);


--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 227
-- Name: historique_reclamations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historique_reclamations_id_seq', 1, false);


--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 229
-- Name: historique_statuts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historique_statuts_id_seq', 1, false);


--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 223
-- Name: reclamations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reclamations_id_seq', 12, true);


--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 225
-- Name: reponses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reponses_id_seq', 1, false);


--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 4799 (class 2606 OID 16826)
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- TOC entry 4805 (class 2606 OID 16886)
-- Name: historique_reclamations historique_reclamations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_reclamations
    ADD CONSTRAINT historique_reclamations_pkey PRIMARY KEY (id);


--
-- TOC entry 4807 (class 2606 OID 16907)
-- Name: historique_statuts historique_statuts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_statuts
    ADD CONSTRAINT historique_statuts_pkey PRIMARY KEY (id);


--
-- TOC entry 4801 (class 2606 OID 16842)
-- Name: reclamations reclamations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamations
    ADD CONSTRAINT reclamations_pkey PRIMARY KEY (id);


--
-- TOC entry 4803 (class 2606 OID 16866)
-- Name: reponses reponses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reponses
    ADD CONSTRAINT reponses_pkey PRIMARY KEY (id);


--
-- TOC entry 4795 (class 2606 OID 16813)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4797 (class 2606 OID 16811)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4812 (class 2606 OID 16887)
-- Name: historique_reclamations historique_reclamations_reclamation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_reclamations
    ADD CONSTRAINT historique_reclamations_reclamation_id_fkey FOREIGN KEY (reclamation_id) REFERENCES public.reclamations(id);


--
-- TOC entry 4813 (class 2606 OID 16892)
-- Name: historique_reclamations historique_reclamations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_reclamations
    ADD CONSTRAINT historique_reclamations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4814 (class 2606 OID 16908)
-- Name: historique_statuts historique_statuts_reclamation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historique_statuts
    ADD CONSTRAINT historique_statuts_reclamation_id_fkey FOREIGN KEY (reclamation_id) REFERENCES public.reclamations(id);


--
-- TOC entry 4808 (class 2606 OID 16848)
-- Name: reclamations reclamations_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamations
    ADD CONSTRAINT reclamations_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- TOC entry 4809 (class 2606 OID 25111)
-- Name: reclamations reclamations_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reclamations
    ADD CONSTRAINT reclamations_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.users(id);


--
-- TOC entry 4810 (class 2606 OID 16867)
-- Name: reponses reponses_reclamation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reponses
    ADD CONSTRAINT reponses_reclamation_id_fkey FOREIGN KEY (reclamation_id) REFERENCES public.reclamations(id);


--
-- TOC entry 4811 (class 2606 OID 16872)
-- Name: reponses reponses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reponses
    ADD CONSTRAINT reponses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-07-01 11:40:22

--
-- PostgreSQL database dump complete
--

\unrestrict LzI8uxAXF4W2rEvsvDLfLjObrf1HNCHLb0Wdijj5kUqfAXt6yS6bsDC5gyKKVOE

