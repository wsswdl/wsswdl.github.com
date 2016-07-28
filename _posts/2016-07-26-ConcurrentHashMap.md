---
layout: post
title: ConcurrentHashMap详解
category: juc
---


## 介绍：

ConcurrentHashMap是线程安全的hashmap，在多线程的情况下使用ConcurrentHashMap既能保证线程的安全，又能保证性能的最优，hashtable虽然也是线程安全的，可是在多线程的情况下效率低下。

## 特点：

1.ConcurrentHashMap在发生冲突的时候和hashmap一样采用链地址法，可是ConcurrentHashMap又多了一种数据结构叫做Segment，每次线程访问的时候只锁其对应的segment，不同的segment可以并发执行。
2.JDK8对hashmap和ConcurrentHashMap在底层实现上有个重大的改变：JDK8之前的版本在同一个hash值的链上采用的是链表的结构，这样的不好之处是如果某个hash值冲突特别严重的话，对此链上数据的查询就接近于O(n)，严重的降低了查询的效率，因此在JDK8开始，当链表的长度大于8时后续的存储采用了红黑树的数据结构，这样就算冲突严重，最差也是O(lgn)的查询时间复杂度。

## 原理：

ConcurrentHashMap的类图：

![image](/image/ConcurrentHashMap/1.png )

1.ConcurrentHashMap继承于AbstractMap抽象类。
2.Segment是ConcurrentHashMap中的内部类，它就是ConcurrentHashMap中的“锁分段”对应的存储结构。ConcurrentHashMap与Segment是组合关系，1个ConcurrentHashMap对象包含若干个Segment对象。在代码中，这表现为ConcurrentHashMap类中存在“Segment数组”成员。
3.Segment类继承于ReentrantLock类，所以Segment本质上是一个可重入的互斥锁。
4.HashEntry也是ConcurrentHashMap的内部类，是单向链表节点，存储着key-value键值对。Segment与HashEntry是组合关系，Segment类中存在“HashEntry数组”成员，“HashEntry数组”中的每个HashEntry就是一个单向链表。
 
## 源码分析：

#### 1.创建



    @SuppressWarnings("unchecked")
    public ConcurrentHashMap(int initialCapacity,
                             float loadFactor, int concurrencyLevel) {
        // 参数有效性判断
        if (!(loadFactor > 0) || initialCapacity < 0 || concurrencyLevel <= 0)
            throw new IllegalArgumentException();
        // concurrencyLevel是“用来计算segments的容量”
        if (concurrencyLevel > MAX_SEGMENTS)
            concurrencyLevel = MAX_SEGMENTS;
        int sshift = 0;
        int ssize = 1;
        // ssize=“大于或等于concurrencyLevel的最小的2的N次方值”
        while (ssize < concurrencyLevel) {
            ++sshift;
            ssize <<= 1;
        }
        // 初始化segmentShift和segmentMask
        this.segmentShift = 32 - sshift;
        this.segmentMask = ssize - 1;
        // 哈希表的初始容量
        // 哈希表的实际容量=“segments的容量” x “segments中数组的长度”
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        // “哈希表的初始容量” / “segments的容量”
        int c = initialCapacity / ssize;
        if (c * ssize < initialCapacity)
            ++c;
        // cap就是“segments中的HashEntry数组的长度”
        int cap = MIN_SEGMENT_TABLE_CAPACITY;
        while (cap < c)
            cap <<= 1;
        // segments
        Segment<K,V> s0 =
            new Segment<K,V>(loadFactor, (int)(cap * loadFactor),
                             (HashEntry<K,V>[])new HashEntry[cap]);
        Segment<K,V>[] ss = (Segment<K,V>[])new Segment[ssize];
        UNSAFE.putOrderedObject(ss, SBASE, s0); // ordered write of segments[0]
        this.segments = ss;
    }

说明：

1.concurrencyLevel的作用就是用来计算segments数组的容量大小。先计算出“大于或等于concurrencyLevel的最小的2的N次方值”，然后将其保存为“segments的容量大小(ssize)”。
2.initialCapacity是哈希表的初始容量。需要注意的是，哈希表的实际容量=“segments的容量” x “segments中数组的长度”。
3.loadFactor是加载因子。它是哈希表在其容量自动增加之前可以达到多满的一种尺度。

ConcurrentHashMap采用了“锁分段”技术，其通过Segment数据结构实现的，Segment定义如下：

        static final class Segment<K,V> extends ReentrantLock implements Serializable {
            ...
        
            transient volatile HashEntry<K,V>[] table;
            // threshold阈，是哈希表在其容量自动增加之前可以达到多满的一种尺度。
            transient int threshold;
            // loadFactor是加载因子
            final float loadFactor;
        
            Segment(float lf, int threshold, HashEntry<K,V>[] tab) {
                this.loadFactor = lf;
                this.threshold = threshold;
                this.table = tab;
            }
        
            ...
        }
    

说明：

1.Segment中又包含了HashEntry，HashEntry就是真正存储数据的结构，Segment只是用来分段；
2.Segment继承了ReentrantLock，说明Segment本身也是一个可重入独占锁，保证并发下的线程安全。

HashEntry是真正存储数据的结构，HashEntry的源码如下：



    static final class HashEntry<K,V> {
        final int hash;    // 哈希值
        final K key;       // 键
        volatile V value;  // 值
        volatile HashEntry<K,V> next; // 下一个HashEntry节点
    
        HashEntry(int hash, K key, V value, HashEntry<K,V> next) {
            this.hash = hash;
            this.key = key;
            this.value = value;
            this.next = next;
        }
    
        ...
    }

说明：和HashMap的节点一样，HashEntry也是链表。这就说明，ConcurrentHashMap是链式哈希表，它是通过“拉链法”来解决哈希冲突的。

#### 2.增加

下面以put(K key, V value)来对ConcurrentHashMap中增加键值对来进行说明。

    public V put(K key, V value) {
        Segment<K,V> s;
        if (value == null)
            throw new NullPointerException();
        // 获取key对应的哈希值
        int hash = hash(key);
        int j = (hash >>> segmentShift) & segmentMask;
        // 如果找不到该Segment，则新建一个。
        if ((s = (Segment<K,V>)UNSAFE.getObject          // nonvolatile; recheck
             (segments, (j << SSHIFT) + SBASE)) == null) // in ensureSegment
            s = ensureSegment(j);
        return s.put(key, hash, value, false);
    }

说明：

1.put()根据key获取对应的哈希值，再根据哈希值找到对应的Segment片段。如果Segment片段不存在，则新增一个Segment。
2.将key-value键值对添加到Segment片段中。

Segment的put方法如下：

    final V put(K key, int hash, V value, boolean onlyIfAbsent) {
        // tryLock()获取锁，成功返回true，失败返回false。
        // 获取锁失败的话，则通过scanAndLockForPut()获取锁，并返回”要插入的key-value“对应的”HashEntry链表“。
        HashEntry<K,V> node = tryLock() ? null :
            scanAndLockForPut(key, hash, value);
        V oldValue;
        try {
            // tab代表”当前Segment中的HashEntry数组“
            HashEntry<K,V>[] tab = table;
            //  根据”hash值“获取”HashEntry数组中对应的HashEntry链表“
            int index = (tab.length - 1) & hash;
            HashEntry<K,V> first = entryAt(tab, index);
            for (HashEntry<K,V> e = first;;) {
                // 如果”HashEntry链表中的当前HashEntry节点“不为null，
                if (e != null) {
                    K k;
                    // 当”要插入的key-value键值对“已经存在于”HashEntry链表中“时，先保存原有的值。
                    // 若”onlyIfAbsent“为true，即”要插入的key不存在时才插入”，则直接退出；
                    // 否则，用新的value值覆盖原有的原有的值。
                    if ((k = e.key) == key ||
                        (e.hash == hash && key.equals(k))) {
                        oldValue = e.value;
                        if (!onlyIfAbsent) {
                            e.value = value;
                            ++modCount;
                        }
                        break;
                    }
                    e = e.next;
                }
                else {
                    // 如果node非空，则将first设置为“node的下一个节点”。
                    // 否则，新建HashEntry链表
                    if (node != null)
                        node.setNext(first);
                    else
                        node = new HashEntry<K,V>(hash, key, value, first);
                    int c = count + 1;
                    // 如果添加key-value键值对之后，Segment中的元素超过阈值(并且，HashEntry数组的长度没超过限制)，则rehash；
                    // 否则，直接添加key-value键值对。
                    if (c > threshold && tab.length < MAXIMUM_CAPACITY)
                        rehash(node);
                    else
                        setEntryAt(tab, index, node);
                    ++modCount;
                    count = c;
                    oldValue = null;
                    break;
                }
            }
        } finally {
            // 释放锁
            unlock();
        }
        return oldValue;
    }

说明：

1.此put方法首先会通过tryLock()和scanAndLockForPut()方法获取锁；
2.得到锁后查找到Segment里的HashEntry链，通过for循环来检查key是否已经存在在map中，如果，存在，则将value改变，然后直接返回，如果此key不在map中，将新的HashEntry节点插入到链上；
3.插入到链上后会判断Segment容量是否超过阈值，超过的话则调用rehash()将容量扩充2倍；
4.如果没超过，则调用setEntryAt()更新链表头，值得注意的是，链表的插入采用的头插法。

为了保证插入的正确性，每次都要获取锁后才能进行插入操作，scanAndLockForPut()方法比较有意思：



    private HashEntry<K,V> scanAndLockForPut(K key, int hash, V value) {
        // 第一个HashEntry节点
        HashEntry<K,V> first = entryForHash(this, hash);
        // 当前的HashEntry节点
        HashEntry<K,V> e = first;
        HashEntry<K,V> node = null;
        // 重复计数(自旋计数器)
        int retries = -1; // negative while locating node
    
        // 查找”key-value键值对“在”HashEntry链表上对应的节点“；
        // 若找到的话，则不断的自旋；在自旋期间，若通过tryLock()获取锁成功则返回；否则自旋MAX_SCAN_RETRIES次数之后，强制获取”锁“并退出。
        // 若没有找到的话，则新建一个HashEntry链表。然后不断的自旋。
        // 此外，若在自旋期间，HashEntry链表的表头发生变化；则重新进行查找和自旋工作！
        while (!tryLock()) {
            HashEntry<K,V> f; // to recheck first below
            // 1. retries<0的处理情况
            if (retries < 0) {
                // 1.1 如果当前的HashEntry节点为空(意味着，在该HashEntry链表上上没有找到”要插入的键值对“对应的节点)，而且node=null；则新建HashEntry链表。
                if (e == null) {
                    if (node == null) // speculatively create node
                        node = new HashEntry<K,V>(hash, key, value, null);
                    retries = 0;
                }
                // 1.2 如果当前的HashEntry节点是”要插入的键值对在该HashEntry上对应的节点“，则设置retries=0
                else if (key.equals(e.key))
                    retries = 0;
                // 1.3 设置为下一个HashEntry。
                else
                    e = e.next;
            }
            // 2. 如果自旋次数超过限制，则获取“锁”并退出
            else if (++retries > MAX_SCAN_RETRIES) {
                lock();
                break;
            }
            // 3. 当“尝试了偶数次”时，就获取“当前Segment的第一个HashEntry”，即f。
            // 然后，通过f!=first来判断“当前Segment的第一个HashEntry是否发生了改变”。
            // 若是的话，则重置e，first和retries的值，并重新遍历。
            else if ((retries & 1) == 0 &&
                    (f = entryForHash(this, hash)) != first) {
                e = first = f; // re-traverse if entry changed
                retries = -1;
            }
        }
        return node;
    }

说明：

1.此方法在试图获取锁时采用了“自旋锁”+“独占锁”的方式实现的；
2.通过while(!tryLock)不断的轮询试图获取锁，如果次数超过最大值则调用lock()方法，lock()方法详情见ReetrantLock，大体的原理就是将此线程放到队列里进行排队，挂起，直到可以获取资源再被唤醒。

#### 3.获取

下面以get(Object key)为例，对ConcurrentHashMap的获取方法进行说明。



    public V get(Object key) {
        Segment<K,V> s; // manually integrate access methods to reduce overhead
        HashEntry<K,V>[] tab;
        int h = hash(key);
        long u = (((h >>> segmentShift) & segmentMask) << SSHIFT) + SBASE;
        // 获取key对应的Segment片段。
        // 如果Segment片段不为null，则在“Segment片段的HashEntry数组中”中找到key所对应的HashEntry列表；
        // 接着遍历该HashEntry链表，找到于key-value键值对对应的HashEntry节点。
        if ((s = (Segment<K,V>)UNSAFE.getObjectVolatile(segments, u)) != null &&
            (tab = s.table) != null) {
            for (HashEntry<K,V> e = (HashEntry<K,V>) UNSAFE.getObjectVolatile
                     (tab, ((long)(((tab.length - 1) & h)) << TSHIFT) + TBASE);
                 e != null; e = e.next) {
                K k;
                if ((k = e.key) == key || (e.hash == h && key.equals(k)))
                    return e.value;
            }
        }
        return null;
    }

说明：
get(Object key)的作用是返回key在ConcurrentHashMap哈希表中对应的值。它首先根据key计算出来的哈希值，获取key所对应的Segment片段，如果Segment片段不为null，则在“Segment片段的HashEntry数组中”中找到key所对应的HashEntry列表。Segment包含“HashEntry数组”对象，而每一个HashEntry本质上是一个单向链表。
接着遍历该HashEntry链表，找到于key-value键值对对应的HashEntry节点。

#### 4.删除

下面以remove(Object key)来对ConcurrentHashMap中的删除操作来进行说明。

    public V remove(Object key) {
        int hash = hash(key);
        // 根据hash值，找到key对应的Segment片段。
        Segment<K,V> s = segmentForHash(hash);
        return s == null ? null : s.remove(key, hash, null);
    }

说明：remove()首先根据“key的计算出来的哈希值”找到对应的Segment片段，然后再从该Segment片段中删除对应的“key-value键值对”。

Segment的remove方法如下。

    final V remove(Object key, int hash, Object value) {
        // 尝试获取Segment对应的锁。
        // 尝试失败的话，则通过scanAndLock()来获取锁。
        if (!tryLock())
            scanAndLock(key, hash);
        V oldValue = null;
        try {
            // 根据“hash值”找到“Segment的HashEntry数组”中对应的“HashEntry节点(e)”，该HashEntry节点是一HashEntry个链表。
            HashEntry<K,V>[] tab = table;
            int index = (tab.length - 1) & hash;
            HashEntry<K,V> e = entryAt(tab, index);
            HashEntry<K,V> pred = null;
            // 遍历“HashEntry链表”，删除key-value键值对
            while (e != null) {
                K k;
                HashEntry<K,V> next = e.next;
                if ((k = e.key) == key ||
                    (e.hash == hash && key.equals(k))) {
                    V v = e.value;
                    if (value == null || value == v || value.equals(v)) {
                        if (pred == null)
                            setEntryAt(tab, index, next);
                        else
                            pred.setNext(next);
                        ++modCount;
                        --count;
                        oldValue = v;
                    }
                    break;
                }
                pred = e;
                e = next;
            }
        } finally {
            // 释放锁
            unlock();
        }
        return oldValue;
    }

