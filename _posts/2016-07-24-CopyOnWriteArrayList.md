---
layout: post
title: CopyOnWriteArrayList详解
category: juc
---

## 介绍：
CopyOnWriteArrayList 是可以在多线程下使用的list，相当于线程安全的ArrayList。

## 特点：
1. 它最适合于List 大小通常保持很小，只读操作远多于可变操作，需要在遍历期间防止线程间的冲突。
2. 它是线程安全的。
3. 因为通常需要复制整个基础数组，所以可变操作（add()、set() 和 remove() 等等）的开销很大。
4. 迭代器支持hasNext(), next()等不可变操作，但不支持可变 remove()等操作。 
5. 使用迭代器进行遍历的速度很快，并且不会与其他线程发生冲突。在构造迭代器时，迭代器依赖于不变的数组快照。

## 原理：

![image](/image/CopyOnWriteArrayList/1.jpg )

1. 在add（），put（），remove（）等操作的时候，都需要加锁（ReetrantLock）,变更操作结束后才释放锁；
2. 在add（），put（），remove（）等操作的时候，需要通过Arrays.copyOf（）方法将原先的数组全部复制一遍，然后加入或减去新的元素，最后再将新数组直接替换旧数组；
3. 在使用iterator（）遍历的时候，遍历的是当时获取的数组快照，就算遍历期间有修改操作，也不会抛出异常；

## 源码分析：

### 1.基础定义

    /** The lock protecting all mutators */
    final transient ReentrantLock lock = new ReentrantLock();
    
    /** The array, accessed only via getArray/setArray. */
    private transient volatile Object[] array;
    
    /**
      * Gets the array.  Non-private so as to also be accessible
      * from CopyOnWriteArraySet class.
      */
     final Object[] getArray() {
        return array;
     }
    
     /**
      * Sets the array.
      */
     final void setArray(Object[] a) {
         array = a;
     }

说明：CopyOnWriteArrayList底层是通过Object[] array数组实现的，其中volatile表示数组是“最新的”，在有元素更新的时候都用lock上锁，数组元素的更新和获取通过setArray（）和getArray（）方法实现。

#### 2.添加
以add（）为例：

     /**
         * Appends the specified element to the end of this list.
         *
         * @param e element to be appended to this list
         * @return {@code true} (as specified by {@link Collection#add})
         */
        public boolean add(E e) {
            final ReentrantLock lock = this.lock;
            lock.lock();
            try {
                Object[] elements = getArray();
                int len = elements.length;
                Object[] newElements = Arrays.copyOf(elements, len + 1);
                newElements[len] = e;
                setArray(newElements);
                return true;
            } finally {
                lock.unlock();
            }
        }

说明 :每次添加时会获取独占锁，并上锁，通过Arrays.copyOf（）新生成一个数组，添加新元素后再通过setArray方法整体替换，最后解锁。

#### 3.获取get（）：

    // Positional Access Operations

    @SuppressWarnings("unchecked")
    private E get(Object[] a, int index) {
        return (E) a[index];
    }

很简单，通过数组的下表返回元素

#### 4.删除remove（）:

    /**
     * Removes the element at the specified position in this list.
     * Shifts any subsequent elements to the left (subtracts one from their
     * indices).  Returns the element that was removed from the list.
     *
     * @throws IndexOutOfBoundsException {@inheritDoc}
     */
    public E remove(int index) {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            Object[] elements = getArray();
            int len = elements.length;
            E oldValue = get(elements, index);
            int numMoved = len - index - 1;
            if (numMoved == 0)
                setArray(Arrays.copyOf(elements, len - 1));
            else {
                Object[] newElements = new Object[len - 1];
                System.arraycopy(elements, 0, newElements, 0, index);
                System.arraycopy(elements, index + 1, newElements, index,
                                 numMoved);
                setArray(newElements);
            }
            return oldValue;
        } finally {
            lock.unlock();
        }
    }

Arrays.copyOf（）的底层就是通过System.arraycopy（）实现的。

#### 5.遍历
    static final class COWIterator<E> implements ListIterator<E> {
        /** Snapshot of the array */
        private final Object[] snapshot;
        /** Index of element to be returned by subsequent call to next.  */
        private int cursor;

        private COWIterator(Object[] elements, int initialCursor) {
            cursor = initialCursor;
            snapshot = elements;
        }

        public boolean hasNext() {
            return cursor < snapshot.length;
        }

        public boolean hasPrevious() {
            return cursor > 0;
        }

        @SuppressWarnings("unchecked")
        public E next() {
            if (! hasNext())
                throw new NoSuchElementException();
            return (E) snapshot[cursor++];
        }

        @SuppressWarnings("unchecked")
        public E previous() {
            if (! hasPrevious())
                throw new NoSuchElementException();
            return (E) snapshot[--cursor];
        }

        public int nextIndex() {
            return cursor;
        }

        public int previousIndex() {
            return cursor-1;
        }

        /**
         * Not supported. Always throws UnsupportedOperationException.
         * @throws UnsupportedOperationException always; {@code remove}
         *         is not supported by this iterator.
         */
        public void remove() {
            throw new UnsupportedOperationException();
        }

        /**
         * Not supported. Always throws UnsupportedOperationException.
         * @throws UnsupportedOperationException always; {@code set}
         *         is not supported by this iterator.
         */
        public void set(E e) {
            throw new UnsupportedOperationException();
        }

遍历时不支持add（），set（），remove（）。