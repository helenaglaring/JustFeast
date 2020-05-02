CREATE TABLE product
(
    product_id SERIAL PRIMARY KEY NOT NULL,
	product_name character varying (255) NOT NULL,
	product_price integer NOT NULL
);


CREATE TABLE "user"
(
	user_id SERIAL PRIMARY KEY NOT NULL,
	first_name character varying (255) NOT NULL,
	last_name character varying (255) NOT NULL,
	_password character varying (255) NOT NULL,
	email character varying (255) NOT NULL,
	phone character varying (255),
	created_date date NOT NULL DEFAULT NOW()
);


CREATE TABLE "order"
(
	order_id SERIAL PRIMARY KEY NOT NULL,
	user_id integer NOT NULL,
	order_date date DEFAULT now(),
	status character varying (255),
	comment character varying (255)
);


CREATE TABLE lineitem
(
	product_id integer NOT NULL,
	order_id integer NOT NULL,
	qty integer NOT NULL,
	lineitem_price integer NOT NULL
);


CREATE TABLE address
(
	address_id SERIAL PRIMARY KEY NOT NULL,
	delivery_id int NOT NULL,
	streetname character varying (255),
	streetnumber character varying (255),
	zipcode integer,
	city character varying (255),
	CONSTRAINT delivery_id_constraint UNIQUE (delivery_id)
);


CREATE TABLE delivery
(
	delivery_id SERIAL PRIMARY KEY  NOT NULL,
	order_id integer NOT NULL,
	delivery boolean DEFAULT FALSE,
	address_id integer,
	delivery_time character varying(255) NOT NULL,
	CONSTRAINT order_id_constraint UNIQUE (order_id)
);

CREATE TABLE payment
(
	payment_id SERIAL PRIMARY KEY NOT NULL,
	order_id integer NOT NULL,
	user_id integer,
	amount integer,
	payment_date date DEFAULT NOW()
);


ALTER TABLE "order" ADD
	CONSTRAINT order_user_id_fkey FOREIGN KEY (user_id)
		REFERENCES public."user" (user_id) MATCH SIMPLE
 		ON UPDATE NO ACTION
		ON DELETE CASCADE;


ALTER TABLE lineitem
    ADD CONSTRAINT lineitem_pkey PRIMARY KEY (product_id, order_id),
	ADD CONSTRAINT lineitem_order_id_fkey FOREIGN KEY (order_id)
		REFERENCES public."order" (order_id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE CASCADE,
    ADD CONSTRAINT lineitem_product_id_fkey FOREIGN KEY (product_id)
		REFERENCES public.product (product_id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION;

ALTER TABLE address
    ADD CONSTRAINT address_delivery_id_fkey FOREIGN KEY (delivery_id)
		REFERENCES public.delivery (delivery_id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE CASCADE;


ALTER TABLE delivery
    ADD CONSTRAINT delivery_order_id_fkey FOREIGN KEY (order_id)
		REFERENCES public."order" (order_id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE CASCADE,
    ADD CONSTRAINT delivery_address_id_fkey FOREIGN KEY (address_id)
        REFERENCES address (address_id)
        ON DELETE CASCADE;

ALTER TABLE payment
    ADD CONSTRAINT payment_order_id_fkey FOREIGN KEY (order_id)
		REFERENCES public."order" (order_id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE CASCADE,
	ADD CONSTRAINT payment_user_id_fkey FOREIGN KEY (user_id)
		REFERENCES public."user" (user_id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE CASCADE;

INSERT INTO product (product_id, product_name, product_price)
    VALUES
        (DEFAULT, 'Burger', 45),
        (DEFAULT, 'Fries', 25),
        (DEFAULT, 'Water', 10);


CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
