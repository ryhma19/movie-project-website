--
-- PostgreSQL database dump
--

-- \restrict shW6BXbya4JbvwPw0LMCOjjbNBQChSkUNtrPbaPoUt4QtSqCAVu7TZfmlKBbb46

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-10 12:45:11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16887)
-- Name: favorite_list_shares; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorite_list_shares (
    user_id integer NOT NULL,
    token text NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 16868)
-- Name: favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorites (
    user_id integer NOT NULL,
    media_id bigint NOT NULL,
    added_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 16945)
-- Name: group_join_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_join_requests (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    user_id integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    decided_at timestamp with time zone
);


--
-- TOC entry 230 (class 1259 OID 16944)
-- Name: group_join_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.group_join_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 230
-- Name: group_join_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.group_join_requests_id_seq OWNED BY public.group_join_requests.id;


--
-- TOC entry 229 (class 1259 OID 16925)
-- Name: group_memberships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_memberships (
    group_id integer NOT NULL,
    user_id integer NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 232 (class 1259 OID 16970)
-- Name: group_movies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_movies (
    group_id integer NOT NULL,
    media_id bigint NOT NULL,
    added_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 228 (class 1259 OID 16908)
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    name text NOT NULL,
    owner_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 16907)
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 227
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- TOC entry 222 (class 1259 OID 16826)
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    id bigint NOT NULL,
    tmdb_id integer NOT NULL,
    kind text NOT NULL,
    title text
);


--
-- TOC entry 221 (class 1259 OID 16825)
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 221
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- TOC entry 224 (class 1259 OID 16840)
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    media_id bigint NOT NULL,
    rating smallint NOT NULL,
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- TOC entry 223 (class 1259 OID 16839)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 223
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 220 (class 1259 OID 16809)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    display_name text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 16808)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4903 (class 2604 OID 16948)
-- Name: group_join_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_join_requests ALTER COLUMN id SET DEFAULT nextval('public.group_join_requests_id_seq'::regclass);


--
-- TOC entry 4900 (class 2604 OID 16911)
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- TOC entry 4894 (class 2604 OID 16829)
-- Name: media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- TOC entry 4895 (class 2604 OID 16843)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 4892 (class 2604 OID 16812)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4923 (class 2606 OID 16899)
-- Name: favorite_list_shares favorite_list_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_list_shares
    ADD CONSTRAINT favorite_list_shares_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4925 (class 2606 OID 16901)
-- Name: favorite_list_shares favorite_list_shares_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_list_shares
    ADD CONSTRAINT favorite_list_shares_token_key UNIQUE (token);


--
-- TOC entry 4921 (class 2606 OID 16876)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (user_id, media_id);


--
-- TOC entry 4931 (class 2606 OID 16959)
-- Name: group_join_requests group_join_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_join_requests
    ADD CONSTRAINT group_join_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4929 (class 2606 OID 16933)
-- Name: group_memberships group_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_memberships
    ADD CONSTRAINT group_memberships_pkey PRIMARY KEY (group_id, user_id);


--
-- TOC entry 4933 (class 2606 OID 16978)
-- Name: group_movies group_movies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_movies
    ADD CONSTRAINT group_movies_pkey PRIMARY KEY (group_id, media_id);


--
-- TOC entry 4927 (class 2606 OID 16919)
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- TOC entry 4913 (class 2606 OID 16836)
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- TOC entry 4915 (class 2606 OID 16838)
-- Name: media media_tmdb_id_kind_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_tmdb_id_kind_key UNIQUE (tmdb_id, kind);


--
-- TOC entry 4917 (class 2606 OID 16855)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4919 (class 2606 OID 16857)
-- Name: reviews reviews_user_id_media_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_media_id_key UNIQUE (user_id, media_id);


--
-- TOC entry 4909 (class 2606 OID 16824)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4911 (class 2606 OID 16822)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4938 (class 2606 OID 16902)
-- Name: favorite_list_shares favorite_list_shares_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite_list_shares
    ADD CONSTRAINT favorite_list_shares_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4936 (class 2606 OID 16882)
-- Name: favorites favorites_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_media_id_fkey FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- TOC entry 4937 (class 2606 OID 16877)
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4942 (class 2606 OID 16960)
-- Name: group_join_requests group_join_requests_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_join_requests
    ADD CONSTRAINT group_join_requests_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- TOC entry 4943 (class 2606 OID 16965)
-- Name: group_join_requests group_join_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_join_requests
    ADD CONSTRAINT group_join_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4940 (class 2606 OID 16934)
-- Name: group_memberships group_memberships_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_memberships
    ADD CONSTRAINT group_memberships_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- TOC entry 4941 (class 2606 OID 16939)
-- Name: group_memberships group_memberships_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_memberships
    ADD CONSTRAINT group_memberships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4944 (class 2606 OID 16979)
-- Name: group_movies group_movies_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_movies
    ADD CONSTRAINT group_movies_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- TOC entry 4945 (class 2606 OID 16984)
-- Name: group_movies group_movies_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_movies
    ADD CONSTRAINT group_movies_media_id_fkey FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- TOC entry 4939 (class 2606 OID 16920)
-- Name: groups groups_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4934 (class 2606 OID 16863)
-- Name: reviews reviews_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_media_id_fkey FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- TOC entry 4935 (class 2606 OID 16858)
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-11-10 12:45:11

--
-- PostgreSQL database dump complete
--

-- \unrestrict shW6BXbya4JbvwPw0LMCOjjbNBQChSkUNtrPbaPoUt4QtSqCAVu7TZfmlKBbb46

