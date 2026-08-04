export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sellers: {
        Row: {
          id: string
          name: string
          phone: string | null
          whatsapp_url: string | null
          slug: string
          banner_url: string | null
          country: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          whatsapp_url?: string | null
          slug: string
          banner_url?: string | null
          country?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          whatsapp_url?: string | null
          slug?: string
          banner_url?: string | null
          country?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          seller_id: string
          name: string
          description: string | null
          price: number | null
          image_url: string | null
          category_id: string | null
          details: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          name: string
          description?: string | null
          price?: number | null
          image_url?: string | null
          category_id?: string | null
          details?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          name?: string
          description?: string | null
          price?: number | null
          image_url?: string | null
          category_id?: string | null
          details?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          seller_id: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          total_amount: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          total_amount: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          total_amount?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          subtotal: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity?: number
          unit_price: number
          subtotal: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          unit_price?: number
          subtotal?: number
          created_at?: string
        }
      }
    }
  }
}
